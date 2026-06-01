// FILE: src/app/layout.tsx

// FILE: src/app/layout.tsx

import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventMS — Discover & Manage Events",
  description:
    "Browse events, buy tickets instantly, and manage your own events with QR check-in.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              background: "#111827",
              color: "#fff",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#e11d48", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}