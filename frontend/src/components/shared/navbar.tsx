// FILE: src/components/shared/navbar.tsx

"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, CalendarDays, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, isAuthenticated, isOrganizer, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  const links = [
    { href: "/events", label: "Browse Events" },
    ...(isOrganizer ? [{ href: "/organizer", label: "My Events" }] : []),
    ...(isAuthenticated ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  const linkClass = (href: string) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      pathname === href
        ? "bg-rose-50 text-rose-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-rose-600 transition-colors"
          >
            <CalendarDays className="text-rose-600" size={24} />
            EventMS
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  Hi, <strong>{user?.name.split(" ")[0]}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block ${linkClass(l.href)}`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg text-sm bg-rose-600 text-white hover:bg-rose-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}