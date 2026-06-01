// FILE: src/services/tickets.service.ts

import api from "./api";
import { Ticket } from "@/types/event.types";

export const ticketsService = {
  book: async (eventId: string, quantity = 1): Promise<Ticket> => {
    const { data } = await api.post("/tickets", { eventId, quantity });
    return data.data;
  },

  getMyTickets: async (): Promise<Ticket[]> => {
    const { data } = await api.get("/tickets/my-tickets");
    return data.data;
  },

  getById: async (id: string): Promise<Ticket> => {
    const { data } = await api.get(`/tickets/${id}`);
    return data.data;
  },

  getEventAttendees: async (eventId: string): Promise<Ticket[]> => {
    const { data } = await api.get(`/tickets/event/${eventId}`);
    return data.data;
  },

  cancel: async (id: string): Promise<Ticket> => {
    const { data } = await api.delete(`/tickets/${id}`);
    return data.data;
  },
};