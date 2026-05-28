// Location: backend/src/modules/events/events.module.ts
// Purpose: NestJS module that registers the Event schema, controller, and service.
//          Exports EventsService so TicketsModule can call incrementBooked().

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventSchema } from './schemas/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}