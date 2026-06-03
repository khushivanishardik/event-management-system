// FILE: src/app/page.tsx

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Ticket,
  Users,
} from "lucide-react";

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
    desc: "Explore events by category, city, venue, and date.",
  },
  {
    icon: <Ticket className="text-rose-500" size={28} />,
    title: "Book Tickets",
    desc: "Reserve your seat instantly and manage tickets from your dashboard.",
  },
  {
    icon: <Users className="text-rose-500" size={28} />,
    title: "Manage Events",
    desc: "Organizers can create, edit, publish, and delete events easily.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-gray-950 via-rose-950 to-gray-900 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="text-rose-400 font-medium text-sm uppercase tracking-widest mb-4">
              Event Management Platform
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Experience Events
              <br />
              <span className="text-rose-400">
                Made Simple
              </span>
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
              Discover amazing events, reserve your seats,
              and manage events effortlessly through a
              modern platform designed for attendees and
              organizers.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 bg-rose-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-rose-700 transition-colors shadow-lg"
              >
                Browse Events
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/signup?role=organizer"
                className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-7 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Become an Organizer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need
            </h2>

            <p className="text-gray-500 mt-3">
              Built for both event attendees and organizers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>

                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Ready to Host Your Event?
          </h2>

          <p className="text-gray-500 text-lg mb-8">
            Create an organizer account and start publishing
            events for your audience today.
          </p>

          <Link
            href="/signup?role=organizer"
            className="inline-flex items-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-rose-700 transition-colors shadow-lg text-lg"
          >
            Become an Organizer
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Browse by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/events?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all group"
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