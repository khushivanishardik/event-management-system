// Location: frontend/src/services/auth.service.ts
// Purpose: All authentication API calls (signup, login, profile fetch).
//          Returns typed responses consumed by the auth Zustand store.

import api from './api';
import { AuthResponse, LoginPayload, SignupPayload, User } from '@/types/auth.types';

export const authService = {
  /** POST /auth/signup */
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/signup', payload);
    return data;
  },

  /** POST /auth/login */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  /** GET /auth/profile — requires valid JWT */
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/profile');
    return data.data;
  },
};