// Location: backend/src/modules/events/schemas/event.schema.ts
// Purpose: Mongoose schema for the Event collection. Stores event metadata,
//          ticket tiers, pricing, capacity, and organizer reference.

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum EventCategory {
  MUSIC = 'music',
  TECH = 'tech',
  SPORTS = 'sports',
  ARTS = 'arts',
  FOOD = 'food',
  BUSINESS = 'business',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  venue: string;

  @Prop({ required: true })
  city: string;

  @Prop({ default: '' })
  bannerImage: string; // Cloudinary URL

  @Prop({ required: true, min: 0 })
  price: number; // base ticket price in INR paise

  @Prop({ required: true, min: 1 })
  totalCapacity: number;

  @Prop({ default: 0 })
  bookedCount: number;

  @Prop({ enum: EventCategory, default: EventCategory.OTHER })
  category: EventCategory;

  @Prop({ enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  organizer: Types.ObjectId; // Reference to user with ORGANIZER role

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false })
  isFeatured: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);

// Virtual: available seats
EventSchema.virtual('availableSeats').get(function () {
  return this.totalCapacity - this.bookedCount;
});

EventSchema.set('toJSON', { virtuals: true });