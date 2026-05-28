// Location: frontend/src/services/events.service.ts
// Purpose: API calls for event browsing and management.
//          Public calls (no auth) and protected calls (organizer/admin).

import api from './api';
import {
  Event,
  EventFilters,
  PaginatedEvents,
  CreateEventPayload,
} from '@/types/event.types';

export const eventsService = {
  /** GET /events — public, with optional filters */
  getAll: async (filters?: EventFilters): Promise<PaginatedEvents> => {
    const { data } = await api.get('/events', { params: filters });
    return data.data;
  },

  /** GET /events/:id — public */
  getById: async (id: string): Promise<Event> => {
    const { data } = await api.get(`/events/${id}`);
    return data.data;
  },

  /** GET /events/my-events — organizer only */
  getMyEvents: async (): Promise<Event[]> => {
    const { data } = await api.get('/events/my-events');
    return data.data;
  },

  /** POST /events — organizer/admin */
  create: async (payload: CreateEventPayload): Promise<Event> => {
    const { data } = await api.post('/events', payload);
    return data.data;
  },

  /** PATCH /events/:id — organizer/admin */
  update: async (
    id: string,
    payload: Partial<CreateEventPayload & { status: string }>,
  ): Promise<Event> => {
    const { data } = await api.patch(`/events/${id}`, payload);
    return data.data;
  },

  /** DELETE /events/:id — organizer/admin */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};