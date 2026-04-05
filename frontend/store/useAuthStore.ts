import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string; // e.g. "ADMIN", "USER", "MODERATOR"
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
      isAdmin: () => {
        const role = get().user?.role;
        return role === "ADMIN" || role === "MODERATOR";
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
