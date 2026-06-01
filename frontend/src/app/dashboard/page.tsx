// FILE: src/app/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Ticket, QrCode, MapPin, Clock, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAuth, useRequireAuth } from "@/hooks/useAuth";
import { ticketsService } from "@/services/tickets.service";
import { Ticket as TicketType } from "@/types/event.types";
import { formatEventDate, formatPrice } from "@/utils/format-date";
import { downloadQRCode } from "@/utils/generate-qr";

const STATUS_STYLES: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
  checked_in: "bg-blue-100 text-blue-700",
};

const STATUS_EMOJI: Record<string, string> = {
  pending: "⏳", confirmed: "✅", cancelled: "❌", checked_in: "🎫",
};

export default function DashboardPage() {
  useRequireAuth();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [qrTicket, setQrTicket] = useState<TicketType | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await ticketsService.getMyTickets();
      setTickets(data);
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this ticket?")) return;
    try {
      await ticketsService.cancel(id);
      toast.success("Ticket cancelled");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  const stats = [
    { label: "Total Tickets", value: tickets.length, icon: "🎟️" },
    { label: "Confirmed", value: tickets.filter((t) => t.status === "confirmed").length, icon: "✅" },
    { label: "Used", value: tickets.filter((t) => t.status === "checked_in").length, icon: "🎫" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {user?.name?.split(" ")[0]}!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tickets list */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Ticket size={20} className="text-rose-500" />
          My Tickets
        </h2>
        <button
          onClick={load}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <div className="text-6xl mb-4">🎟️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No tickets yet</h3>
          <p className="text-gray-500 mb-6">Book your first event!</p>
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-rose-100 to-orange-50 shrink-0">
                {ticket.event?.bannerImage ? (
                  <Image src={ticket.event.bannerImage} alt={ticket.event.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">🎪</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {ticket.event?.title}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {formatEventDate(ticket.event?.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={11} /> {ticket.event?.venue}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[ticket.status]}`}>
                    {STATUS_EMOJI[ticket.status]} {ticket.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-gray-500">
                    {ticket.quantity}× · {formatPrice(ticket.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                {ticket.status === "confirmed" && ticket.qrCode && (
                  <Button size="sm" variant="secondary" onClick={() => setQrTicket(ticket)}>
                    <QrCode size={14} /> QR Code
                  </Button>
                )}
                {ticket.status === "confirmed" && (
                  <Button size="sm" variant="danger" onClick={() => handleCancel(ticket._id)}>
                    <XCircle size={14} /> Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Modal */}
      <Modal
        isOpen={!!qrTicket}
        onClose={() => setQrTicket(null)}
        title="Your Ticket QR Code"
        size="sm"
      >
        {qrTicket && (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 font-medium">{qrTicket.event?.title}</p>
            <div className="flex justify-center">
              <img
                src={qrTicket.qrCode}
                alt="QR Code"
                className="w-56 h-56 rounded-2xl border border-gray-100"
              />
            </div>
            <p className="text-xs text-gray-400">Show at the venue entrance</p>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => downloadQRCode(qrTicket.qrCode, `ticket-${qrTicket._id}.png`)}
            >
              Download QR
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}