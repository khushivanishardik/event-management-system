// Location: backend/src/modules/payments/payments.service.ts
// Purpose: Razorpay payment integration.
//          - createOrder:    Creates a Razorpay order for a ticket
//          - verifyPayment:  Validates Razorpay webhook signature, confirms ticket
//          - getOrderStatus: Checks payment status for a given order

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { TicketsService } from '../tickets/tickets.service';
import { EmailService } from '../../common/services/email.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpay: Razorpay;

  constructor(
    private readonly ticketsService: TicketsService,
    private readonly emailService: EmailService,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  /**
   * Step 1: Create Razorpay order for a pending ticket.
   * Returns the order object that the frontend passes to Razorpay checkout.
   */
  async createOrder(ticketId: string, userId: string) {
    const ticket = await this.ticketsService.getTicket(ticketId, userId);

    const order = await this.razorpay.orders.create({
      amount: (ticket as any).totalAmount, // in paise
      currency: 'INR',
      receipt: ticketId,
      notes: {
        ticketId,
        userId,
      },
    });

    return order;
  }

  /**
   * Step 2: Verify Razorpay signature after frontend payment success.
   * Uses HMAC-SHA256 to ensure the payment response is genuine.
   */
  async verifyPayment(dto: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    ticketId: string;
    userEmail: string;
    userName: string;
    eventName: string;
  }) {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      ticketId,
      userEmail,
      userName,
      eventName,
    } = dto;

    // Verify HMAC signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      throw new BadRequestException('Invalid payment signature');
    }

    // Confirm the ticket in the database
    const confirmedTicket = await this.ticketsService.confirmTicket(
      ticketId,
      razorpayOrderId,
      razorpayPaymentId,
    );

    // Send confirmation email with QR code
    try {
      await this.emailService.sendTicketConfirmation(
        userEmail,
        userName,
        eventName,
        ticketId,
        confirmedTicket.qrCode,
      );
    } catch (emailError) {
      // Non-fatal — log but don't fail the payment confirmation
      this.logger.error('Failed to send confirmation email', emailError);
    }

    return confirmedTicket;
  }
}