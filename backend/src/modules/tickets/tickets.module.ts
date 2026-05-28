// Location: backend/src/modules/tickets/tickets.module.ts
// Purpose: Registers Ticket schema and wires TicketsService with EventsModule.

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    EventsModule, // Provides EventsService for capacity checks
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}