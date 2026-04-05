"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Step 1: Login → get raw JWT token string
      const loginRes = await axios.post(`${API_URL}/api/v1/auth/login`, { username, password });
      const token: string = loginRes.data;

      // Step 2: Get user info with role via /me
      const meRes = await axios.get(`${API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = meRes.data;
      const roleName = user.role?.name || user.role;

      if (roleName !== "ADMIN" && roleName !== "MODERATOR") {
        setError("Tài khoản này không có quyền ADMIN.");
        setLoading(false);
        return;
      }

      setAuth(
        {
          id: user._id || user.id,
          name: user.name || user.username,
          email: user.email,
          role: roleName,
          avatar: user.avatar,
        },
        token
      );
      router.push("/admin/categories");
    } catch {
      setError("Đăng nhập thất bại. Kiểm tra lại tài khoản / mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-700/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative w-full max-w-md p-8 md:p-10 bg-slate-900 border border-white/5 rounded-3xl shadow-2xl flex flex-col">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 mb-4">
            <span className="material-symbols-outlined text-3xl text-blue-400">admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Đăng nhập với tài khoản ADMIN</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-1.5">Tên đăng nhập</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
              className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-1.5">Mật khẩu</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-all duration-200 text-sm"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
