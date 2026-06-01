// FILE: src/types/event.types.ts

import { User } from "./auth.types";

export type EventStatus = "draft" | "published" | "cancelled" | "completed";
export type EventCategory =
  | "music"
  | "tech"
  | "sports"
  | "arts"
  | "food"
  | "business"
  | "other";

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  endDate: string;
  venue: string;
  city: string;
  bannerImage: string;
  price: number;
  totalCapacity: number;
  bookedCount: number;
  availableSeats: number;
  category: EventCategory;
  status: EventStatus;
  organizer: Pick<User, "_id" | "name" | "email" | "avatar">;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
}

export interface EventFilters {
  page?: number;
  limit?: number;
  city?: string;
  category?: EventCategory;
  search?: string;
  featured?: boolean;
}

export interface PaginatedEvents {
  events: Event[];
  total: number;
  page: number;
  pages: number;
}

export type TicketStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "checked_in";

export interface Ticket {
  _id: string;
  user: string;
  event: Event;
  quantity: number;
  totalAmount: number;
  status: TicketStatus;
  qrCode: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  checkedInAt: string | null;
  createdAt: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  endDate: string;
  venue: string;
  city: string;
  price: number;
  totalCapacity: number;
  category: EventCategory;
  tags?: string[];
  isFeatured?: boolean;
  bannerImage?: string;
}