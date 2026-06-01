// FILE: src/components/shared/footer.tsx

import Link from "next/link";
import { CalendarDays } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <CalendarDays className="text-rose-500" size={22} />
              EventMS
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Discover and attend amazing events, or create your own and manage
              ticket sales with ease.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="hover:text-white transition-colors">Browse Events</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/organizer" className="hover:text-white transition-colors">Organizer Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} EventMS. All rights reserved.</p>
          <p>Built with NestJS + Next.js</p>
        </div>
      </div>
    </footer>
  );
}