"use client";
import { useState } from "react";
import { useAdminSubPackages } from "@/app/admin/(protected)/sub-packages/useAdminSubPackages";

interface Props {
  onClose: () => void;
  onSubmit: (packageId: string) => void;
  loading?: boolean;
  currentPackageId?: string;
}

export function RenewModal({
  onClose,
  onSubmit,
  loading,
  currentPackageId,
}: Props) {
  const [packageId, setPackageId] = useState(currentPackageId || "");
  const { packages } = useAdminSubPackages();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            Gia hạn Subscription
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-500">Chọn gói gia hạn mới:</p>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {packages.map((pkg) => (
              <button
                key={pkg._id}
                onClick={() => setPackageId(pkg._id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${packageId === pkg._id ? "bg-purple-50 border-purple-300 text-purple-700" : "bg-white border-slate-200 text-slate-600 hover:border-purple-300"}`}
              >
                <div className="text-left">
                  <div>{pkg.name}</div>
                  <div className="text-xs font-normal text-slate-400">
                    {pkg.type === "monthly"
                      ? "Hàng tháng"
                      : pkg.type === "yearly"
                        ? "Hàng năm"
                        : "Vĩnh viễn"}
                    {pkg.durationDays > 0 && ` · ${pkg.durationDays} ngày`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-purple-700">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(pkg.price)}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {packages.length === 0 && (
            <p className="text-sm text-slate-400 text-center">
              Chưa có gói nào.{" "}
              <a href="/admin/sub-packages" className="text-blue-500 underline">
                Tạo gói
              </a>{" "}
              trước.
            </p>
          )}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={() => packageId && onSubmit(packageId)}
            disabled={!packageId || loading}
            className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="material-symbols-outlined text-sm animate-spin">
                progress_activity
              </span>
            )}
            {loading ? "Đang xử lý..." : "Gia hạn"}
          </button>
        </div>
      </div>
    </div>
  );
}
