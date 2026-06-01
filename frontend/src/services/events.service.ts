// FILE: src/services/events.service.ts

import api from "./api";
import {
  Event,
  EventFilters,
  PaginatedEvents,
  CreateEventPayload,
} from "@/types/event.types";

export const eventsService = {
  getAll: async (filters?: EventFilters): Promise<PaginatedEvents> => {
    const { data } = await api.get("/events", { params: filters });
    return data.data;
  },

  getById: async (id: string): Promise<Event> => {
    const { data } = await api.get(`/events/${id}`);
    return data.data;
  },

  getMyEvents: async (): Promise<Event[]> => {
    const { data } = await api.get("/events/my-events");
    return data.data;
  },

  create: async (payload: CreateEventPayload): Promise<Event> => {
    const { data } = await api.post("/events", payload);
    return data.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateEventPayload & { status: string }>
  ): Promise<Event> => {
    const { data } = await api.patch(`/events/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};