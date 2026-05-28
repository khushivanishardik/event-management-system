// Location: backend/src/modules/checkin/checkin.service.ts
// Purpose: QR code check-in logic for event entry.
//          Parses the QR payload, validates the ticket, and marks it as CHECKED_IN.
//          Returns attendee info for the venue scanner UI.

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument, TicketStatus } from '../tickets/schemas/ticket.schema';

@Injectable()
export class CheckinService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
  ) {}

  /**
   * Process a QR code scan at the venue.
   * @param qrData - Raw string decoded from the QR code
   * @returns Attendee information on successful check-in
   */
  async processCheckin(qrData: string) {
    let payload: { ticketId: string; eventId: string; paymentId: string };

    try {
      payload = JSON.parse(qrData);
    } catch {
      throw new BadRequestException('Invalid QR code format');
    }

    const ticket = await this.ticketModel
      .findById(payload.ticketId)
      .populate('user', 'name email')
      .populate('event', 'title date venue');

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Validate it's for the right event
    if (ticket.event['_id'].toString() !== payload.eventId) {
      throw new BadRequestException('QR code is for a different event');
    }

    if (ticket.status === TicketStatus.CHECKED_IN) {
      return {
        alreadyCheckedIn: true,
        checkedInAt: ticket.checkedInAt,
        attendee: ticket.user,
        event: ticket.event,
      };
    }

    if (ticket.status !== TicketStatus.CONFIRMED) {
      throw new BadRequestException(
        `Cannot check in: ticket status is ${ticket.status}`,
      );
    }

    // Mark as checked in
    ticket.status = TicketStatus.CHECKED_IN;
    ticket.checkedInAt = new Date();
    await ticket.save();

    return {
      alreadyCheckedIn: false,
      checkedInAt: ticket.checkedInAt,
      attendee: ticket.user,
      event: ticket.event,
      quantity: ticket.quantity,
    };
  }

  /** Get check-in stats for an event */
  async getCheckinStats(eventId: string) {
    const [total, checkedIn] = await Promise.all([
      this.ticketModel.countDocuments({
        event: eventId,
        status: { $in: [TicketStatus.CONFIRMED, TicketStatus.CHECKED_IN] },
      }),
      this.ticketModel.countDocuments({
        event: eventId,
        status: TicketStatus.CHECKED_IN,
      }),
    ]);

    return {
      totalConfirmed: total,
      checkedIn,
      remaining: total - checkedIn,
      percentage: total > 0 ? Math.round((checkedIn / total) * 100) : 0,
    };
  }
}