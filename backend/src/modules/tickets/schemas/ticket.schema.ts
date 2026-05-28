// Location: backend/src/modules/tickets/schemas/ticket.schema.ts
// Purpose: Mongoose schema for Ticket. Each ticket represents one seat
//          purchased by a user for an event. Stores QR code, payment info,
//          and check-in status.

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TicketDocument = Ticket & Document;

export enum TicketStatus {
  PENDING = 'pending',       // Payment initiated but not confirmed
  CONFIRMED = 'confirmed',   // Payment successful
  CANCELLED = 'cancelled',   // Refunded/cancelled
  CHECKED_IN = 'checked_in', // QR scanned at venue
}

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  totalAmount: number; // in INR paise

  @Prop({ enum: TicketStatus, default: TicketStatus.PENDING })
  status: TicketStatus;

  @Prop({ default: '' })
  qrCode: string; // Base64 data URL

  @Prop({ default: '' })
  razorpayOrderId: string;

  @Prop({ default: '' })
  razorpayPaymentId: string;

  @Prop({ type: Date, default: null })
  checkedInAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);