// Location: frontend/src/services/tickets.service.ts
// Purpose: API calls for ticket booking, retrieval, and cancellation.

import api from './api';
import { Ticket } from '@/types/event.types';

export const ticketsService = {
  /** POST /tickets — book a ticket (creates PENDING) */
  book: async (eventId: string, quantity = 1): Promise<Ticket> => {
    const { data } = await api.post('/tickets', { eventId, quantity });
    return data.data;
  },

  /** GET /tickets/my-tickets */
  getMyTickets: async (): Promise<Ticket[]> => {
    const { data } = await api.get('/tickets/my-tickets');
    return data.data;
  },

  /** GET /tickets/:id */
  getById: async (id: string): Promise<Ticket> => {
    const { data } = await api.get(`/tickets/${id}`);
    return data.data;
  },

  /** GET /tickets/event/:eventId — organizer: list attendees */
  getEventAttendees: async (eventId: string): Promise<Ticket[]> => {
    const { data } = await api.get(`/tickets/event/${eventId}`);
    return data.data;
  },

  /** DELETE /tickets/:id — cancel ticket */
  cancel: async (id: string): Promise<Ticket> => {
    const { data } = await api.delete(`/tickets/${id}`);
    return data.data;
  },
};