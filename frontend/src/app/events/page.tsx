// FILE: src/app/events/page.tsx

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { EventCard } from "@/components/shared/event-card";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/event.store";
import { EventCategory } from "@/types/event.types";

const CATEGORIES: { label: string; value: EventCategory | "" }[] = [
  { label: "All", value: "" },
  { label: "🎵 Music", value: "music" },
  { label: "💻 Tech", value: "tech" },
  { label: "⚽ Sports", value: "sports" },
  { label: "🎨 Arts", value: "arts" },
  { label: "🍽️ Food", value: "food" },
  { label: "💼 Business", value: "business" },
];

function EventsContent() {
  const searchParams = useSearchParams();
  const { events, pagination, isLoading, fetchEvents } = useEventStore();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [category, setCategory] = useState<EventCategory | "">(
    (searchParams.get("category") as EventCategory) || ""
  );
  const [page, setPage] = useState(1);

  const load = (overrides?: Record<string, unknown>) => {
    fetchEvents({
      page,
      limit: 12,
      search: search || undefined,
      city: city || undefined,
      category: (category as EventCategory) || undefined,
      ...overrides,
    });
  };

  useEffect(() => { load(); }, [page, category]); // eslint-disable-line

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load({ page: 1 });
  };

  const clearAll = () => {
    setSearch("");
    setCity("");
    setCategory("");
    setPage(1);
    fetchEvents({ page: 1, limit: 12 });
  };

  const hasFilters = search || city || category;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Discover Events
        </h1>
        <p className="text-gray-500">
          {pagination.total > 0
            ? `${pagination.total} events available`
            : "Find your next experience"}
        </p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="sm:w-36 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <Button type="submit" size="md">
          <Search size={15} /> Search
        </Button>
        {hasFilters && (
          <Button type="button" variant="ghost" size="md" onClick={clearAll}>
            <X size={15} /> Clear
          </Button>
        )}
      </form>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={String(cat.value)}
            onClick={() => {
              setCategory(cat.value as EventCategory | "");
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              category === cat.value
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-rose-600"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No events found
          </h3>
          <p className="text-gray-500 mb-6">Try different keywords or clear filters</p>
          <Button variant="secondary" onClick={clearAll}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === pagination.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" /></div>}>
      <EventsContent />
    </Suspense>
  );
}