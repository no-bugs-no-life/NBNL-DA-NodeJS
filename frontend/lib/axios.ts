/**
 * Unified Axios instance cho toàn bộ dự án.
 * - Tự động gắn Authorization token từ localStorage
 * - Tự động redirect /login khi nhận 401
 */
import axios from "axios";
import { API_URL } from "@/configs/api";

const api = axios.create({ baseURL: API_URL });

// ── Request: gắn Bearer token ──────────────────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: 401 → logout + redirect /login ────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export { api as axios };
export default api;
