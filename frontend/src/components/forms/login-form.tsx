'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import {
  Mail,
  Lock,
} from 'lucide-react';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

import { useAuthStore } from '@/store/auth.store';

/**
 * Validation schema
 */
const schema = z.object({
  email: z
    .string()
    .email(
      'Please enter a valid email',
    ),

  password: z
    .string()
    .min(
      6,
      'Password must be at least 6 characters',
    ),
});

type FormData = z.infer<
  typeof schema
>;

export function LoginForm() {
  const router = useRouter();

  const {
    login,
    isLoading,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FormData>({
    resolver:
      zodResolver(schema),
  });

  /**
   * Submit handler
   */
  const onSubmit = async (
    data: FormData,
  ) => {
    try {
      await login(data);

      toast.success(
        'Welcome back!',
      );

      router.push('/events');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Login failed. Please try again.';

      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit,
      )}
      className="space-y-5"
    >
      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Email address
        </label>

        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <Input
            type="email"
            placeholder="you@example.com"
            className="pl-10"
            {...register(
              'email',
            )}
          />
        </div>

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {
              errors.email
                .message
            }
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Password
        </label>

        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <Input
            type="password"
            placeholder="••••••••"
            className="pl-10"
            {...register(
              'password',
            )}
          />
        </div>

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {
              errors.password
                .message
            }
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading
          ? 'Logging in...'
          : 'Log in'}
      </Button>
    </form>
  );
}