// FILE: src/types/auth.types.ts

export type Role = "user" | "organizer" | "admin";

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