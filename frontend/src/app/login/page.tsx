// FILE: src/app/login/page.tsx

"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";
import { useRedirectIfAuthenticated } from "@/hooks/useAuth";

export default function LoginPage() {
  useRedirectIfAuthenticated("/events");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-rose-50/30">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-2xl">
              <CalendarDays className="text-rose-600" size={28} />
              EventMS
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500 text-center text-sm mb-8">
            Sign in to your account to continue
          </p>

          <LoginForm />

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-rose-600 hover:text-rose-700 hover:underline underline-offset-2"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}