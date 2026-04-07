"use client";

import { Shield } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface MeResponse {
  _id?: string;
  email?: string;
  username?: string;
  fullName?: string;
  role?: string | { name?: string };
}

interface SecurityStatusResponse {
  twoFactorEnabled: boolean;
  twoFactorUpdatedAt?: string;
}

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [twoFaCode, setTwoFaCode] = useState("");
  const [setupCode, setSetupCode] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["profile", "security", "me"],
    queryFn: async () => {
      const res = await api.get("/api/v1/auth/me");
      return (res.data?.data || res.data) as MeResponse;
    },
  });

  const { data: securityStatus, refetch: refetchSecurityStatus } = useQuery({
    queryKey: ["profile", "security", "status"],
    queryFn: async () => {
      const res = await api.get("/api/v1/auth/security-status");
      return (res.data?.data || res.data) as SecurityStatusResponse;
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () =>
      api.post("/api/v1/auth/change-password", {
        currentPassword,
        newPassword,
      }),
    onSuccess: () => {
      setMessage("Đổi mật khẩu thành công");
      setCurrentPassword("");
      setNewPassword("");
    },
    onError: () => setMessage("Đổi mật khẩu thất bại"),
  });

  const enable2FAMutation = useMutation({
    mutationFn: async () => api.post("/api/v1/auth/enable-2fa"),
    onSuccess: (res) => {
      const payload = res.data?.data || res.data;
      setSetupCode(payload?.setupCode || null);
      setMessage("Đã tạo mã thiết lập 2FA");
      refetchSecurityStatus();
    },
    onError: () => setMessage("Không thể bật 2FA"),
  });

  const verify2FAMutation = useMutation({
    mutationFn: async () => api.post("/api/v1/auth/verify-2fa", { code: twoFaCode }),
    onSuccess: () => {
      setMessage("Xác minh 2FA thành công");
      setTwoFaCode("");
      setSetupCode(null);
      refetchSecurityStatus();
    },
    onError: () => setMessage("Mã 2FA không hợp lệ"),
  });

  const roleName =
    typeof data?.role === "object" ? data?.role?.name : data?.role || "USER";

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-sm mx-auto w-full">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
          <Shield className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Khoá bảo mật</h2>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${securityStatus?.twoFactorEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
          >
            {securityStatus?.twoFactorEnabled ? "2FA: Đang bật" : "2FA: Chưa bật"}
          </span>
        </div>
        <p className="text-slate-500 text-sm mb-4">
          {isLoading
            ? "Đang tải thông tin bảo mật..."
            : `Tài khoản: ${data?.email || data?.username || "---"} · Vai trò: ${roleName}`}
        </p>

        <div className="w-full space-y-3 text-left">
          <input
            type="password"
            placeholder="Mật khẩu hiện tại"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
          />
          <button
            onClick={() => changePasswordMutation.mutate()}
            disabled={changePasswordMutation.isPending || !currentPassword || !newPassword}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 text-white text-sm disabled:opacity-50"
          >
            Đổi mật khẩu
          </button>

          <button
            onClick={() => enable2FAMutation.mutate()}
            disabled={enable2FAMutation.isPending || !!securityStatus?.twoFactorEnabled}
            className="w-full px-3 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm disabled:opacity-50"
          >
            {securityStatus?.twoFactorEnabled ? "2FA đã bật" : "Bật 2FA"}
          </button>

          {setupCode && (
            <p className="text-xs text-slate-600">
              Mã thiết lập 2FA: <span className="font-semibold">{setupCode}</span>
            </p>
          )}

          <input
            type="text"
            placeholder="Nhập mã 2FA"
            value={twoFaCode}
            onChange={(e) => setTwoFaCode(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
          />
          <button
            onClick={() => verify2FAMutation.mutate()}
            disabled={verify2FAMutation.isPending || !twoFaCode}
            className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-50"
          >
            Xác minh 2FA
          </button>

          {message && <p className="text-xs text-slate-500">{message}</p>}
        </div>
      </div>
    </div>
  );
}
