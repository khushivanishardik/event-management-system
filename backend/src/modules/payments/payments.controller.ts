// Location: backend/src/modules/payments/payments.controller.ts
// Purpose: REST controller for payment flow.
//   POST /api/payments/create-order  - Create Razorpay order
//   POST /api/payments/verify        - Verify payment and confirm ticket

import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { successResponse } from '../../common/utils/response';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  async createOrder(@Body('ticketId') ticketId: string, @Request() req) {
    const order = await this.paymentsService.createOrder(ticketId, req.user._id);
    return successResponse(order, 'Payment order created');
  }

  @Post('verify')
  async verify(@Body() body: any, @Request() req) {
    const result = await this.paymentsService.verifyPayment({
      ...body,
      userEmail: req.user.email,
      userName: req.user.name,
    });
    return successResponse(result, 'Payment verified and ticket confirmed');
  }
}