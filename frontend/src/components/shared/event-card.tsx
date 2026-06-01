import Link from "next/link";
import { Event } from "@/types/event.types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border">
      <h3 className="text-lg font-bold">{event.title}</h3>

      <p className="text-gray-600 mt-2">
        {event.description}
      </p>

      <div className="mt-3 text-sm text-gray-500">
        <p>📍 {event.city}</p>
        <p>🏢 {event.venue}</p>
        <p>📅 {new Date(event.date).toLocaleDateString()}</p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="font-semibold">
          ₹{event.price}
        </span>

        <Link
          href={`/events/${event._id}`}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg"
        >
          View
        </Link>
      </div>
    </div>
  );
}