// FILE: src/app/organizer/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Eye, Users, BarChart2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EventForm } from "@/components/forms/event-form";
import { useAuth, useRequireAuth } from "@/hooks/useAuth";
import { eventsService } from "@/services/events.service";
import { Event } from "@/types/event.types";
import { formatEventDate, formatPrice } from "@/utils/format-date";

const STATUS_STYLES: Record<string, string> = {
  draft:     "bg-gray-100 text-gray-600",
  published: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function OrganizerPage() {
  useRequireAuth();
  const { user, isOrganizer } = useAuth();

console.log("USER =", user);
console.log("ROLE =", user?.role);
console.log("IS ORGANIZER =", isOrganizer);

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await eventsService.getMyEvents();
      setEvents(data);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await eventsService.delete(id);
      toast.success("Event deleted");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleTogglePublish = async (event: Event) => {
    const newStatus = event.status === "published" ? "draft" : "published";
    try {
      await eventsService.update(event._id, { status: newStatus });
      toast.success(newStatus === "published" ? "🌐 Event is now live!" : "Set to draft");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

//if (!isOrganizer) {
 // return (
 //   <div className="text-center py-24">
   //   <div className="text-5xl mb-4">🔒</div>
   //   <h2 className="text-xl font-semibold text-gray-800 mb-2">
   //     Organizer Access Required
    //  </h2>
    //  <p className="text-gray-500 mb-6">
   ////     Please sign up as an organizer to access this page.
   //   </p>
  //    <Link href="/signup?role=organizer">
   //     <Button>Become an Organizer</Button>
   //   </Link>
 //  </div>
 // );
//}

  const totalRevenue = events.reduce((s, e) => s + e.bookedCount * e.price, 0);

  const stats = [
    { label: "Total Events", value: events.length, icon: <BarChart2 size={20} className="text-rose-500" /> },
    { label: "Published", value: events.filter((e) => e.status === "published").length, icon: <Globe size={20} className="text-green-500" /> },
    { label: "Total Bookings", value: events.reduce((s, e) => s + e.bookedCount, 0), icon: <Users size={20} className="text-blue-500" /> },
    { label: "Revenue", value: formatPrice(totalRevenue), icon: <span className="text-purple-500 font-bold text-lg">₹</span> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizer Portal</h1>
          <p className="text-gray-500 mt-1">Welcome, {user?.name}</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={18} /> Create Event
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Events table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Your Events</h2>
          <span className="text-sm text-gray-400">{events.length} events</span>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎪</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No events yet</h3>
            <p className="text-gray-500 mb-6">Create your first event to get started</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={16} /> Create Event
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {events.map((event) => (
              <div
                key={event._id}
                className="flex flex-col md:flex-row md:items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 truncate text-sm">
                      {event.title}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[event.status]}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-gray-500">
                    <span>{formatEventDate(event.date)}</span>
                    <span>{event.venue}, {event.city}</span>
                    <span>{event.bookedCount}/{event.totalCapacity} booked</span>
                    <span className="font-medium text-gray-700">{formatPrice(event.price)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/events/${event._id}`}>
                    <Button size="sm" variant="ghost">
                      <Eye size={14} />
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost" onClick={() => setEditEvent(event)}>
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant={event.status === "published" ? "secondary" : "primary"}
                    onClick={() => handleTogglePublish(event)}
                  >
                    {event.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(event._id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Event" size="xl">
        <EventForm onSuccess={() => { setShowCreate(false); load(); }} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editEvent} onClose={() => setEditEvent(null)} title="Edit Event" size="xl">
        {editEvent && (
          <EventForm existing={editEvent} onSuccess={() => { setEditEvent(null); load(); }} />
        )}
      </Modal>
    </div>
  );
}