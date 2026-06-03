// FILE: src/app/events/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  MapPin, Clock, Users, ArrowLeft,
  Ticket, CheckCircle, Calendar, Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/event.store";
import { useAuth } from "@/hooks/useAuth";
import { ticketsService } from "@/services/tickets.service";
import {
  formatEventDate,
  formatEventTime,
  formatPrice,
  isEventPast,
} from "@/utils/format-date";

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { selectedEvent: event, fetchEventById, isLoading } = useEventStore();
  const { user, isAuthenticated } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    if (id) fetchEventById(id);
  }, [id]); // eslint-disable-line



  const handleBook = async () => {
  if (!isAuthenticated) {
    toast.error("Please log in to book tickets");
    router.push("/login");
    return;
  }

  setIsBooking(true);

  try {
    const ticket = await ticketsService.book(
      event!._id,
      quantity
    );

    console.log("TICKET =", ticket);

    toast.success("🎉 Ticket booked successfully!");

    setIsBooked(true);

  } catch (err: any) {

    console.error(err);

    toast.error(
      err.response?.data?.message ||
      "Booking failed"
    );

  } finally {
    setIsBooking(false);
  }
};

 

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="h-72 bg-gray-200 rounded-3xl animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Event not found</h2>
        <Link href="/events">
          <Button variant="secondary">← Back to Events</Button>
        </Link>
      </div>
    );
  }

  const isPast = isEventPast(event.date);
  const availableSeats = event.availableSeats ?? event.totalCapacity - event.bookedCount;
  const isSoldOut = availableSeats <= 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner */}
          <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-br from-rose-100 to-orange-50">
            {event.bannerImage ? (
              <Image src={event.bannerImage} alt={event.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20">🎪</div>
            )}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Tag size={12} />
                {event.category}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {event.title}
          </h1>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Calendar size={18} className="text-rose-500" />, label: "Date", value: formatEventDate(event.date) },
              { icon: <Clock size={18} className="text-rose-500" />, label: "Time", value: `${formatEventTime(event.date)} – ${formatEventTime(event.endDate)}` },
              { icon: <MapPin size={18} className="text-rose-500" />, label: "Venue", value: `${event.venue}, ${event.city}` },
              { icon: <Users size={18} className="text-rose-500" />, label: "Seats", value: isSoldOut ? "Sold out" : `${availableSeats} of ${event.totalCapacity} remaining` },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
                <div className="mt-0.5">{item.icon}</div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">About this event</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Tags */}
          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Organizer */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-lg shrink-0">
              {event.organizer?.name?.[0] ?? "?"}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Organized by</p>
              <p className="font-semibold text-gray-900">{event.organizer?.name}</p>
            </div>
          </div>
        </div>

        {/* ── Right: Booking widget ───────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl border border-gray-200 shadow-lg p-6 space-y-5">
            <div>
              <p className="text-sm text-gray-500">Ticket price</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(event.price)}
              </p>
            </div>

            {/* Availability bar */}
            {!isSoldOut && event.totalCapacity > 0 && (
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>{availableSeats} available</span>
                  <span>{event.bookedCount} booked</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${(event.bookedCount / event.totalCapacity) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Quantity */}
            {!isPast && !isSoldOut && !isBooked && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-xl"
                  >
                    −
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(availableSeats, q + 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-xl"
                  >
                    +
                  </button>
                </div>
                {quantity > 1 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Total: {formatPrice(event.price * quantity)}
                  </p>
                )}
              </div>
            )}

            {/* CTA */}
            {isBooked ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 justify-center bg-green-50 text-green-700 rounded-2xl py-4 font-semibold">
                  <CheckCircle size={20} /> Ticket Confirmed!
                </div>
                <Link href="/dashboard">
                  <Button variant="secondary" fullWidth>View My Tickets</Button>
                </Link>
              </div>
            ) : isPast ? (
              <p className="text-center text-gray-500 text-sm py-4 bg-gray-50 rounded-2xl">
                This event has already taken place
              </p>
            ) : isSoldOut ? (
              <p className="text-center text-gray-500 text-sm py-4 bg-gray-100 rounded-2xl font-medium">
                Sold Out
              </p>
            ) : (
              <Button fullWidth size="lg" onClick={handleBook} isLoading={isBooking}>
                <Ticket size={18} /> Book Now
              </Button>
            )}

            <p className="text-xs text-gray-400 text-center">
              Secure payment via Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}