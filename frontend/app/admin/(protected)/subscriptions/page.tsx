"use client";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { useAdminSubscriptions } from "./useAdminSubscriptions";
import { SubscriptionTable } from "@/components/admin/subscriptions/SubscriptionTable";
import { SubscriptionModal } from "@/components/admin/subscriptions/SubscriptionModal";
import { ConfirmModal } from "@/components/admin/subscriptions/ConfirmModal";
import { RenewModal } from "@/components/admin/subscriptions/RenewModal";

function TopBar({ count, onAdd }: { count: number; onAdd: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Quản lý Subscriptions
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Hiển thị {count} subscription(s)
        </p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
      >
        <span className="material-symbols-outlined text-sm">add</span> Tạo mới
      </button>
    </div>
  );
}

function StatusFilterBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "", label: "Tất cả" },
    { value: "active", label: "Hoạt động" },
    { value: "expired", label: "Hết hạn" },
    { value: "cancelled", label: "Đã hủy" },
  ];
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-sm font-semibold text-slate-500">Lọc:</span>
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${value === opt.value ? "bg-white text-slate-800 " : "text-slate-500 hover:text-slate-700"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToastAlert({
  toast,
}: {
  toast: { message: string; type: string } | null;
}) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      <span className="material-symbols-outlined">
        {toast.type === "success" ? "check_circle" : "error"}
      </span>{" "}
      {toast.message}
    </div>
  );
}

export default function AdminSubscriptionsPage() {
  const { checkAuth } = useAuthStore();
  const s = useAdminSubscriptions();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const { isAuthLoading, isAdmin } = s;

  if (!isAuthLoading && !isAdmin()) {
    notFound();
  }

  if (isAuthLoading) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <TopBar
        count={s.subscriptions.length}
        onAdd={() => s.setShowCreate(true)}
      />
      <StatusFilterBar value={s.statusFilter} onChange={s.setStatusFilter} />
      <SubscriptionTable
        subscriptions={s.subscriptions}
        isLoading={s.isLoading}
        onRenew={s.setRenewTarget}
        onCancel={(sub) => {
          s.mCancel.mutate(sub._id);
        }}
        onDelete={s.setDeleteTarget}
        page={s.page}
        totalPages={s.totalPages}
        onPageChange={s.setPage}
      />

      {s.showCreate && (
        <SubscriptionModal
          onClose={() => s.setShowCreate(false)}
          onSubmit={(data) => s.mCreate.mutate({ userId: data.userId, appId: "", subPackageId: data.packageId })}
          loading={s.mCreate.isPending}
        />
      )}

      {s.renewTarget && (
        <RenewModal
          onClose={() => s.setRenewTarget(null)}
          onSubmit={(packageId) =>
            s.mRenew.mutate({ id: s.renewTarget!._id, packageId })
          }
          loading={s.mRenew.isPending}
          currentPackageId={s.renewTarget.packageId?._id}
        />
      )}

      {s.deleteTarget && (
        <ConfirmModal
          title="Xóa Subscription"
          message={`Bạn có chắc muốn xóa subscription của "${s.deleteTarget.userId.fullName}" cho app "${s.deleteTarget.appId.name}" không?`}
          confirmLabel="Xóa"
          onClose={() => s.setDeleteTarget(null)}
          onConfirm={() => s.mDelete.mutate(s.deleteTarget!._id)}
          loading={s.mDelete.isPending}
        />
      )}

      <ToastAlert toast={s.toast} />
    </div>
  );
}
