/**
 * Unified Axios instance cho toàn bộ dự án.
 * - Luôn gửi cookie (withCredentials) để backend đọc HTTP-only cookie (vd: access_token)
 * - Tự động gắn Authorization token từ localStorage (fallback)
 * - Tự động redirect /login khi nhận 401
 */
import axios from "axios";
import { API_URL } from "@/configs/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const token = localStorage.getItem("token");
  if (!token) return config;

  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: 401 → logout + redirect /login ────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export { axiosInstance as axios };
export default axiosInstance;
