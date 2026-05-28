// Location: frontend/src/types/auth.types.ts
// Purpose: TypeScript interfaces for authentication data structures.
//          Shared across auth store, services, and components.

export type Role = 'user' | 'organizer' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}