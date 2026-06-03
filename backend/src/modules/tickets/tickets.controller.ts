// Location: backend/src/modules/tickets/tickets.controller.ts
// Purpose: REST controller for ticket operations.
//   POST /api/tickets              - Book a ticket (creates PENDING)
//   GET  /api/tickets/my-tickets   - Get user's own tickets
//   GET  /api/tickets/:id          - Get single ticket
//   GET  /api/tickets/event/:id    - Organizer: list event attendees
//   DELETE /api/tickets/:id        - Cancel ticket

import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { successResponse } from '../../common/utils/response';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

@Post()
async createTicket(@Body() body: any, @Request() req) {

  console.log("REQ.USER =", req.user);
  console.log("BODY =", body);

  const { eventId, quantity = 1 } = body;

  const ticket = await this.ticketsService.createTicket(
    req.user._id,
    eventId,
    quantity,
  );

  return successResponse(ticket, "Ticket created");
}

  @Get('my-tickets')
  async myTickets(@Request() req) {
    const tickets = await this.ticketsService.getUserTickets(req.user._id);
    return successResponse(tickets, 'Tickets fetched');
  }

  @Get('event/:eventId')
  async eventAttendees(@Param('eventId') eventId: string) {
    const tickets = await this.ticketsService.getEventTickets(eventId);
    return successResponse(tickets, 'Attendees fetched');
  }

  @Get(':id')
  async getTicket(@Param('id') id: string, @Request() req) {
    const ticket = await this.ticketsService.getTicket(id, req.user._id);
    return successResponse(ticket, 'Ticket fetched');
  }

  @Delete(':id')
  async cancelTicket(@Param('id') id: string, @Request() req) {
    const ticket = await this.ticketsService.cancelTicket(id, req.user._id);
    return successResponse(ticket, 'Ticket cancelled');
  }
}