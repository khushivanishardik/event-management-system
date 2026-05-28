// Location: backend/src/modules/checkin/checkin.module.ts
// Purpose: Registers CheckinService and CheckinController.
//          Imports Ticket schema directly to query tickets by QR scan data.

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';
import { Ticket, TicketSchema } from '../tickets/schemas/ticket.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
  ],
  controllers: [CheckinController],
  providers: [CheckinService],
})
export class CheckinModule {}