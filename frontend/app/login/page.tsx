"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore, { apiClient } from "@/store/useAuthStore";
import { LogIn, ArrowLeft } from "lucide-react";

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
      const response = await apiClient.post(`/api/v1/auth/login`, {
        username,
        password,
      });

      const payload = response.data?.data;
      if (payload?.token) {
        login(payload.token);
      }

      await checkAuth();

      const { user } = useAuthStore.getState();
      const roleName = (user?.role as any)?.name || user?.role || "";
      if (roleName === "ADMIN" || roleName === "MODERATOR") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      const errorResponse = err as {
        response?: { data?: { msg?: string } };
      };
      setErrorStr(
        errorResponse.response?.data?.msg ||
        "Sai thông tin đăng nhập. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-surface">
      {/* Cột Trái: Form đăng nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative z-10 min-h-screen">
        {/* Nút Quay Lại */}
        <Link
          href="/"
          className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all font-semibold group px-4 py-2 rounded-full hover:bg-surface-container-high"
          aria-label="Quay lại trang chủ"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Trang chủ</span>
        </Link>

        <div className="w-full max-w-md flex flex-col items-center">
          {/* Logo Header */}
          <div className="mb-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-4xl font-extrabold tracking-tighter text-on-surface mb-3 group"
            >
              <img
                src="/logo.png"
                alt="APKBugs Logo"
                className="h-12 rounded-xl object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                APKBugs
              </span>
            </Link>
            <p className="text-on-surface-variant text-base font-medium mt-2">
              Đăng nhập để khám phá vũ trụ game
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="w-full flex flex-col gap-5 mb-8"
          >
            {errorStr && (
              <div className="p-3.5 bg-error-container text-on-error-container rounded-xl text-sm font-medium text-center border border-error/20">
                {errorStr}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface-variant ml-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium placeholder-outline"
                placeholder="Nhập username"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface-variant ml-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium placeholder-outline"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant/60"
                />
                <span className="text-sm text-on-surface-variant font-medium">
                  Ghi nhớ
                </span>
              </label>
              <Link
                href="#"
                className="text-sm text-primary font-semibold hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-on-primary font-bold py-4 px-4 rounded-2xl transition-all shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 hover:brightness-110"
            >
              {loading ? (
                "Đang xác thực..."
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Đăng nhập</span>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 w-full mb-8">
            <div className="h-[2px] flex-1 bg-surface-container-high rounded-full" />
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Hoặc
            </span>
            <div className="h-[2px] flex-1 bg-surface-container-high rounded-full" />
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold py-3.5 px-4 rounded-2xl transition-all active:scale-[0.98]"
          >
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
          <div className="mt-10 text-center text-sm text-on-surface-variant leading-relaxed">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-primary hover:text-primary-container font-extrabold transition-colors hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Cột Phải: Animation Background (Chỉ cho màn hình lớn) */}
      <div className="hidden lg:flex w-1/2 bg-surface-container relative overflow-hidden items-center justify-center p-12">
        {/* Animated Orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[20%] w-[35vw] h-[35vw] bg-primary/20 rounded-full blur-[100px] animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-[10%] left-[10%] w-[30vw] h-[30vw] bg-secondary/20 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[40%] left-[40%] w-[20vw] h-[20vw] bg-tertiary/20 rounded-full blur-[80px] animate-[pulse_7s_ease-in-out_infinite_2s]" />
        </div>

        {/* Nội dung Animation Floating */}
        <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
          <div className="w-full aspect-square relative flex items-center justify-center">
            {/* Các lớp hình khối xoay và trôi nổi */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-[4rem] rotate-6 animate-[spin_20s_linear_infinite] backdrop-blur-md border border-white/20 shadow-2xl" />
            <div className="absolute inset-6 bg-gradient-to-tr from-surface to-surface-container rounded-[3.5rem] -rotate-3 animate-[spin_25s_linear_infinite_reverse] shadow-2xl flex items-center justify-center overflow-hidden border border-outline-variant/40">
              {/* Inner animated decorative elements */}
              <div className="w-32 h-32 bg-primary/30 rounded-full blur-2xl absolute top-10 left-10 animate-[ping_5s_ease-in-out_infinite]" />
              <div className="w-32 h-32 bg-secondary/30 rounded-full blur-2xl absolute bottom-10 right-10 animate-[pulse_3s_ease-in-out_infinite]" />

              <div className="relative z-20 flex flex-col items-center animate-[bounce_4s_ease-in-out_infinite]">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-36 h-auto rounded-3xl object-contain drop-shadow-2xl"
                />
                <div className="mt-4 px-6 py-2 bg-surface/50 backdrop-blur-lg rounded-full border border-outline-variant/30 text-on-surface font-bold tracking-widest text-sm shadow-lg">
                  GAMING HUB
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-black text-on-surface mb-5 tracking-tight drop-shadow-sm">
              Khám Phá Vũ Trụ
            </h2>
            <p className="text-lg text-on-surface-variant font-medium max-w-sm mx-auto leading-relaxed">
              Kho ứng dụng và trò chơi đỉnh cao nhất luôn được cập nhật mỗi
              ngày. Sẵn sàng cho mọi cuộc chiến!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
