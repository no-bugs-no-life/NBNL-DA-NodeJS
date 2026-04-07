import { create } from "zustand";
import api from "@/lib/axios";

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  avatar?: { _id: string; url: string } | string;
  role?: string;
  coin?: number;
  level?: number;
  xp?: number;
  maxXp?: number;
  bio?: string;
  createdAt?: string;
  coverUrl?: string;
  cover?: { _id: string; url: string } | string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  checkAuth: () => Promise<void>;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
  setAuth: (user: User, token: string) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAdmin: () => {
    const user = get().user;
    if (!user) return false;
    const roleObj = user.role as unknown as { name?: string };
    const roleName = roleObj?.name || user.role;
    return roleName === "ADMIN" || roleName === "MODERATOR";
  },
  setAuth: (user, token) => {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
    set({ user, token, isAuthenticated: true });
  },
  login: (token) => {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      set({ isLoading: true });
      const response = await api.get(`/api/v1/auth/me`);
      const payload = response.data?.data || response.data;
      set({ user: payload, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;
export { api as apiClient };
