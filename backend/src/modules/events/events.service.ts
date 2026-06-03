// Location: backend/src/modules/events/events.service.ts
// Purpose: Business logic for event management.
//          - create:   Organizer creates a new event
//          - findAll:  Public filtered/paginated event list
//          - findOne:  Public single event details
//          - update:   Organizer updates their own event
//          - remove:   Organizer/Admin cancels event
//          - myEvents: Organizer's own events list

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Event, EventDocument, EventStatus } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {}

  /** Create a new event (organizer only) */
  async create(dto: CreateEventDto, organizerId: string) {
  const event = await this.eventModel.create({
    ...dto,
    organizer: organizerId,
    status: EventStatus.PUBLISHED,
  });

  return event;
}

  /** Public: list events with filtering and pagination */
  async findAll(query: {
    page?: number;
    limit?: number;
    city?: string;
    category?: string;
    search?: string;
    featured?: boolean;
  }) {
    const { page = 1, limit = 12, city, category, search, featured } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<EventDocument> = {
      status: EventStatus.PUBLISHED,
    };

    if (city) filter.city = { $regex: city, $options: 'i' };
    if (category) filter.category = category;
    if (featured !== undefined) filter.isFeatured = featured;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const [events, total] = await Promise.all([
      this.eventModel
        .find(filter)
        .populate('organizer', 'name email avatar')
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.eventModel.countDocuments(filter),
    ]);

    return {
      events,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /** Public: single event details */
  async findOne(id: string) {
    const event = await this.eventModel
      .findById(id)
      .populate('organizer', 'name email avatar')
      .lean();
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  /** Organizer: update own event */
  async update(id: string, dto: UpdateEventDto, userId: string, userRole: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');

    if (
      event.organizer.toString() !== userId &&
      userRole !== 'admin'
    ) {
      throw new ForbiddenException('You can only edit your own events');
    }

    Object.assign(event, dto);
    await event.save();
    return event;
  }

  /** Organizer/Admin: cancel/delete event */
  async remove(id: string, userId: string, userRole: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');

    if (event.organizer.toString() !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only delete your own events');
    }

    await event.deleteOne();
    return { message: 'Event deleted successfully' };
  }

  /** Organizer: their own events list */
  async myEvents(organizerId: string) {
    return this.eventModel
      .find({ organizer: organizerId })
      .sort({ createdAt: -1 })
      .lean();
  }

  /** Internal: increment bookedCount after ticket purchase */
  async incrementBooked(eventId: string, count = 1) {
    await this.eventModel.findByIdAndUpdate(eventId, {
      $inc: { bookedCount: count },
    });
  }
}