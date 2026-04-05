"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore, { apiClient } from "@/store/useAuthStore";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorStr, setErrorStr] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login, checkAuth } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStr("");
    setLoading(true);

    try {
      const { data } = await apiClient.post(`/api/v1/auth/login`, {
        username,
        password,
      });

      // Backend yields literal token string
      login(data);
      await checkAuth(); // Load data seamlessly
      router.push("/");
    } catch (err) {
      const errorResponse = err as any;
      setErrorStr(errorResponse.response?.data?.message || "Sai thông tin đăng nhập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md p-8 md:p-10 bg-slate-900 border border-white/5 rounded-3xl shadow-2xl flex flex-col items-center">
        {/* Logo Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-4xl font-extrabold tracking-tighter text-white mb-3"
          >
            APK<span className="text-blue-500">Bugs</span>
          </Link>
          <p className="text-slate-400 text-sm font-medium">
            Đăng nhập để khám phá vũ trụ game
          </p>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 mb-6">
          {errorStr && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium text-center">
              {errorStr}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-300 ml-1">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder-slate-500"
              placeholder="Nhập username"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-300 ml-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder-slate-500"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? "Đang xác thực..." : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Đăng nhập</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-4 w-full mb-6">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs font-semibold text-slate-500">Hoặc</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* Google Login Button */}
        <button type="button" className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-800 font-bold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-95">
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-sm">Tiếp tục với Google</span>
        </button>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-slate-500 leading-relaxed px-4">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-blue-500 hover:text-blue-400 font-bold transition-colors"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
