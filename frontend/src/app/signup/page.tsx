// FILE: src/app/signup/page.tsx

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, Lock, User, Phone, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useRedirectIfAuthenticated } from "@/hooks/useAuth";

const schema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Valid email required"),
  password: z
    .string()
    .min(6, "Minimum 6 characters")
    .regex(/[A-Z]/, "Need one uppercase letter")
    .regex(/[0-9]/, "Need one number"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type RoleOption = "user" | "organizer";

function SignupContent() {
  useRedirectIfAuthenticated("/events");
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as RoleOption) || "user";
  const [role, setRole] = useState<RoleOption>(initialRole);
  const { signup, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await signup({ ...data, role });
      toast.success("Account created! Welcome 🎉");
      router.push(role === "organizer" ? "/organizer" : "/events");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-rose-50/30">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-2xl">
              <CalendarDays className="text-rose-600" size={28} />
              EventMS
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Create your account
          </h1>
          <p className="text-gray-500 text-center text-sm mb-6">
            Join thousands of event-goers and organizers
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {(["user", "organizer"] as RoleOption[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  role === r
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {r === "user" ? "🎟️ Attendee" : "🎪 Organizer"}
              </button>
            ))}
          </div>

          {role === "organizer" && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
              As an organizer you can create events, sell tickets, and use QR
              check-in at the venue.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Your name"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              leftIcon={<Lock size={16} />}
              error={errors.password?.message}
              hint="Needs uppercase letter and number"
              {...register("password")}
            />
            <Input
              label="Phone (optional)"
              type="tel"
              placeholder="+91 98765 43210"
              leftIcon={<Phone size={16} />}
              {...register("phone")}
            />
            <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-rose-600 hover:text-rose-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" /></div>}>
      <SignupContent />
    </Suspense>
  );
}