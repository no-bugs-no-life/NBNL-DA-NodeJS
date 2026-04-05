"use client";
import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useAdminApps } from "@/hooks/useAdminApps";
import { useAdminSubPackages } from "@/app/admin/(protected)/sub-packages/useAdminSubPackages";

interface Props {
  onClose: () => void;
  onSubmit: (data: {
    userId: string;
    appId: string;
    packageId: string;
  }) => void;
  loading?: boolean;
}

export function SubscriptionModal({ onClose, onSubmit, loading }: Props) {
  const [userId, setUserId] = useState("");
  const [appId, setAppId] = useState("");
  const [packageId, setPackageId] = useState("");

  const { data: users = [] } = useUsers();
  const { data: apps = [] } = useAdminApps();
  const { packages } = useAdminSubPackages();

  const isValid = userId && appId && packageId;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({ userId, appId, packageId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Tạo Subscription</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Người dùng <span className="text-red-500">*</span>
            </label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
            >
              <option value="">-- Chọn người dùng --</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.fullName || u.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              App <span className="text-red-500">*</span>
            </label>
            <select
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
            >
              <option value="">-- Chọn app --</option>
              {apps.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Gói Subscription <span className="text-red-500">*</span>
            </label>
            <select
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
            >
              <option value="">-- Chọn gói --</option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.name} (
                  {pkg.type === "monthly"
                    ? "Hàng tháng"
                    : pkg.type === "yearly"
                      ? "Hàng năm"
                      : "Vĩnh viễn"}{" "}
                  —{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(pkg.price)}
                  )
                </option>
              ))}
            </select>
            {packages.length === 0 && (
              <p className="text-xs text-slate-400 mt-1">
                Chưa có gói nào.{" "}
                <a
                  href="/admin/sub-packages"
                  className="text-blue-500 underline"
                >
                  Tạo gói
                </a>{" "}
                trước.
              </p>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Hủy
          </button>
          <button
            disabled={!isValid || loading}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading && (
              <span className="material-symbols-outlined text-sm animate-spin">
                progress_activity
              </span>
            )}
            {loading ? "Đang tạo..." : "Tạo Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
}
