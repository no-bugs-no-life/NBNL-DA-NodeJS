import { create } from "zustand";
import axios from "axios";

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
  coin?: number;
  level?: number;
  xp?: number;
  maxXp?: number;
  bio?: string;
  createdAt?: string;
  coverUrl?: string;
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

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// Interceptor to attach Bearer token automatically if available
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

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
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true });
      const { data } = await apiClient.get(`/api/v1/auth/me`);
      set({ user: data, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

export default useAuthStore;
export { apiClient };
