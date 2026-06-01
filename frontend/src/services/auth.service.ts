// FILE: src/services/auth.service.ts

import api from "./api";
import {
  AuthResponse,
  LoginPayload,
  SignupPayload,
  User,
} from "@/types/auth.types";

export const authService = {
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/signup", payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get("/auth/profile");
    return data.data;
  },
};