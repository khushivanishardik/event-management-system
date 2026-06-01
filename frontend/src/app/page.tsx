// FILE: src/app/page.tsx

import Link from "next/link";
import { ArrowRight, CalendarDays, QrCode, Ticket } from "lucide-react";

const CATEGORIES = [
  { label: "Music", emoji: "🎵", slug: "music" },
  { label: "Tech", emoji: "💻", slug: "tech" },
  { label: "Sports", emoji: "⚽", slug: "sports" },
  { label: "Arts", emoji: "🎨", slug: "arts" },
  { label: "Food", emoji: "🍽️", slug: "food" },
  { label: "Business", emoji: "💼", slug: "business" },
];

const FEATURES = [
  {
    icon: <CalendarDays className="text-rose-500" size={28} />,
    title: "Discover Events",
    desc: "Browse hundreds of events by city, category, or date.",
  },
  {
    icon: <Ticket className="text-rose-500" size={28} />,
    title: "Instant Booking",
    desc: "Book tickets in seconds with secure Razorpay payments.",
  },
  {
    icon: <QrCode className="text-rose-500" size={28} />,
    title: "QR Entry",
    desc: "Receive a QR code ticket and breeze through check-in.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-gray-950 via-rose-950 to-gray-900 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="text-rose-400 font-medium text-sm uppercase tracking-widest mb-4">
              The event platform for everyone
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Experiences worth{" "}
              <span className="text-rose-400">showing up for</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl">
              Discover live events near you, book tickets in seconds, and manage
              your own events with powerful organizer tools.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 bg-rose-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-rose-700 transition-colors shadow-lg"
              >
                Browse Events <ArrowRight size={18} />
              </Link>
              <Link
                href="/signup?role=organizer"
                className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-7 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Create an Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4 items-start">
                <div className="shrink-0 w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Ready to host your own event?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Create an organizer account and start selling tickets in minutes.
          </p>
          <Link
            href="/signup?role=organizer"
            className="inline-flex items-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-rose-700 transition-colors shadow-lg text-lg"
          >
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/events?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl p-5 border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all group text-center"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-rose-600">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}