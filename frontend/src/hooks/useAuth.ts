'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/auth.store';

/**
 * Main auth hook
 */
export function useAuth() {
  const {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    loadFromStorage,
  } = useAuthStore();

  /**
   * Load auth from localStorage
   */
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return {
    user,

    token,

    isLoading,

    isAuthenticated:
      Boolean(token) &&
      Boolean(user),

    isOrganizer:
      user?.role ===
        'organizer' ||
      user?.role === 'admin',

    isAdmin:
      user?.role === 'admin',

    login,

    signup,

    logout,
  };
}

/**
 * Redirect to login
 * if user is NOT authenticated
 */
export function useRequireAuth(
  redirectTo = '/login',
) {
  const router = useRouter();

const {
  token,
  isLoading,
  loadFromStorage,
} = useAuthStore();

useEffect(() => {
  loadFromStorage();
}, [loadFromStorage]);

  useEffect(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return;
    }

    const storedToken =
      localStorage.getItem(
        'token',
      );

    if (
      !storedToken &&
      !token &&
      !isLoading
    ) {
      router.replace(
        redirectTo,
      );
    }
  }, [
    token,
    isLoading,
    router,
    redirectTo,
  ]);

  return {
    isAuthenticated:
      Boolean(token),

    isLoading,
  };
}

/**
 * Redirect authenticated users
 */
export function useRedirectIfAuthenticated(
  redirectTo = '/events',
) {
  const router = useRouter();

  const { token } =
    useAuthStore();

  useEffect(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return;
    }

    const storedToken =
      localStorage.getItem(
        'token',
      );

    if (
      storedToken ||
      token
    ) {
      router.replace(
        redirectTo,
      );
    }
  }, [
    token,
    router,
    redirectTo,
  ]);
}