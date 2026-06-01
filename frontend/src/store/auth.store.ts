// FILE: src/store/auth.store.ts

import { create } from "zustand";
import { User, LoginPayload, SignupPayload } from "@/types/auth.types";
import { authService } from "@/services/auth.service";

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  },

  login: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await authService.login(payload);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  signup: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await authService.signup(payload);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
}));