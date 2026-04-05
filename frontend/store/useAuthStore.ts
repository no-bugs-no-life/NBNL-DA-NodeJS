import { create } from "zustand";
import axios from "axios";

export interface User {
    _id: string;
    username: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
    role?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
    login: (token: string) => void;
    logout: () => void;
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

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: (token) => {
        localStorage.setItem("token", token);
        set({ isAuthenticated: true });
        // checkAuth will be explicitly called post-routing typically or directly here
    },
    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, isAuthenticated: false });
    },
    checkAuth: async () => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        if (!token) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
        }

        try {
            set({ isLoading: true });
            const { data } = await apiClient.get(`/api/v1/auth/me`);
            set({ user: data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem("token");
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));

export default useAuthStore;
export { apiClient };
