// FILE: src/store/event.store.ts

import { create } from 'zustand';

import {
  Event,
  EventFilters,
  PaginatedEvents,
} from '@/types/event.types';

import { eventsService } from '@/services/events.service';

/**
 * Store interface
 */
interface EventStore {
  events: Event[];

  selectedEvent: Event | null;

  pagination: Omit<
    PaginatedEvents,
    'events'
  >;

  filters: EventFilters;

  isLoading: boolean;

  error: string | null;

  fetchEvents: (
    filters?: EventFilters,
  ) => Promise<void>;

  fetchEventById: (
    id: string,
  ) => Promise<void>;

  setFilters: (
    filters: Partial<EventFilters>,
  ) => void;

  clearSelected: () => void;
}

export const useEventStore =
  create<EventStore>((set, get) => ({
    events: [],

    selectedEvent: null,

    pagination: {
      total: 0,
      page: 1,
      pages: 1,
    },

    filters: {
      page: 1,
      limit: 12,
    },

    isLoading: false,

    error: null,

    /**
     * Fetch all events
     */
    fetchEvents: async (
      filters,
    ) => {
      const activeFilters =
        filters ?? get().filters;

      set({
        isLoading: true,
        error: null,
      });

      try {
        const result =
          await eventsService.getAll(
            activeFilters,
          );

        set({
          events: result.events,

          pagination: {
            total: result.total,
            page: result.page,
            pages: result.pages,
          },

          isLoading: false,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to load events';

        set({
          error: message,
          isLoading: false,
        });
      }
    },

    /**
     * Fetch single event
     */
    fetchEventById: async (
      id: string,
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const event =
          await eventsService.getById(
            id,
          );

        set({
          selectedEvent: event,
          isLoading: false,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Event not found';

        set({
          error: message,
          isLoading: false,
        });
      }
    },

    /**
     * Set filters
     */
    setFilters: (
      newFilters,
    ) =>
      set((state) => ({
        filters: {
          ...state.filters,
          ...newFilters,
          page: 1,
        },
      })),

    /**
     * Clear selected event
     */
    clearSelected: () =>
      set({
        selectedEvent: null,
      }),
  }));