"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Step 1: POST /login → nhận raw JWT string
      const loginRes = await axios.post(`${API_URL}/api/v1/auth/login`, {
        username,
        password,
      });
      const token: string = loginRes.data;

      // Step 2: GET /me → lấy thông tin user + role
      const meRes = await axios.get(`${API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = meRes.data;
      const roleName: string = user.role?.name || user.role || "USER";

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

      // Redirect theo role
      if (roleName === "ADMIN" || roleName === "MODERATOR") {
        router.push("/admin/categories");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md p-8 md:p-10 bg-slate-900 border border-white/5 rounded-3xl shadow-2xl flex flex-col">
        {/* Logo Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-4xl font-extrabold tracking-tighter text-white mb-3"
          >
            Horizon<span className="text-blue-500">Store</span>
          </Link>
          <p className="text-slate-400 text-sm font-medium">
            Khám phá vũ trụ game và công cụ vô tận
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="login-username"
              className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider"
            >
              Tên đăng nhập
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-[18px]">
                person
              </span>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập..."
                required
                autoComplete="username"
                className="w-full bg-slate-800 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Mật khẩu
              </label>
              <Link
                href="/login/forgot-password"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-[18px]">
                lock
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                required
                autoComplete="current-password"
                className="w-full bg-slate-800 border border-white/10 text-white rounded-xl pl-10 pr-12 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">
              <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading || !username || !password}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)] mt-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">login</span>
                Đăng nhập
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-slate-500 text-xs">hoặc</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google Login Button (UI only) */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-800 font-semibold py-3.5 px-4 rounded-2xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-base">Tiếp tục với Google</span>
        </button>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Đăng ký ngay
          </Link>
        </p>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-600 leading-relaxed px-4">
          Bằng việc đăng nhập, bạn đồng ý với{" "}
          <Link href="#" className="text-slate-500 hover:text-slate-400 transition-colors">Điều khoản dịch vụ</Link>
          {" "}và{" "}
          <Link href="#" className="text-slate-500 hover:text-slate-400 transition-colors">Chính sách bảo mật</Link>.
        </div>
      </div>
    </div>
  );
}
