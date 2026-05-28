// Location: backend/src/modules/tickets/tickets.service.ts
// Purpose: Handles the ticket purchase flow:
//          1. Check event availability
//          2. Create PENDING ticket
//          3. Generate QR code for ticket ID
//          4. After payment confirmation → update to CONFIRMED
//          Also handles: ticket listing, cancellation

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument, TicketStatus } from './schemas/ticket.schema';
import { EventsService } from '../events/events.service';
import { generateQRCode } from '../../common/utils/qr-generator';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
    private readonly eventsService: EventsService,
  ) {}

  /** Create a ticket (PENDING until payment confirmed) */
  async createTicket(
    userId: string,
    eventId: string,
    quantity: number,
  ) {
    const event = await this.eventsService.findOne(eventId);

    const available = (event as any).totalCapacity - (event as any).bookedCount;
    if (available < quantity) {
      throw new BadRequestException(
        `Only ${available} seats available`,
      );
    }

    const totalAmount = (event as any).price * quantity;

    const ticket = await this.ticketModel.create({
      user: userId,
      event: eventId,
      quantity,
      totalAmount,
      status: TicketStatus.PENDING,
    });

    return ticket;
  }

  /** Confirm ticket after payment — generate QR and update event count */
  async confirmTicket(
    ticketId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
  ) {
    const ticket = await this.ticketModel.findById(ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found');

    // Generate QR payload (ticket ID + payment ID for uniqueness)
    const qrPayload = JSON.stringify({
      ticketId: ticket._id.toString(),
      eventId: ticket.event.toString(),
      paymentId: razorpayPaymentId,
    });

    const qrCode = await generateQRCode(qrPayload);

    ticket.status = TicketStatus.CONFIRMED;
    ticket.razorpayOrderId = razorpayOrderId;
    ticket.razorpayPaymentId = razorpayPaymentId;
    ticket.qrCode = qrCode;
    await ticket.save();

    // Update event booked count
    await this.eventsService.incrementBooked(
      ticket.event.toString(),
      ticket.quantity,
    );

    return ticket;
  }

  /** Get all tickets for a user */
  async getUserTickets(userId: string) {
    return this.ticketModel
      .find({ user: userId })
      .populate('event', 'title date venue city bannerImage')
      .sort({ createdAt: -1 })
      .lean();
  }

  /** Get single ticket (owner only) */
  async getTicket(ticketId: string, userId: string) {
    const ticket = await this.ticketModel
      .findById(ticketId)
      .populate('event')
      .lean();

    if (!ticket) throw new NotFoundException('Ticket not found');

    if (ticket.user.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return ticket;
  }

  /** Organizer: get tickets for a specific event */
  async getEventTickets(eventId: string) {
    return this.ticketModel
      .find({ event: eventId, status: TicketStatus.CONFIRMED })
      .populate('user', 'name email')
      .lean();
  }

  /** Cancel a confirmed ticket */
  async cancelTicket(ticketId: string, userId: string) {
    const ticket = await this.ticketModel.findById(ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found');

    if (ticket.user.toString() !== userId) {
      throw new ForbiddenException('You can only cancel your own tickets');
    }

    if (ticket.status === TicketStatus.CHECKED_IN) {
      throw new BadRequestException('Cannot cancel a used ticket');
    }

    ticket.status = TicketStatus.CANCELLED;
    await ticket.save();
    return ticket;
  }
}