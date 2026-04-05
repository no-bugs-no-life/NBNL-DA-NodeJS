"use client";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { useAdminCoupons } from "./useAdminCoupons";
import { CouponTable } from "@/components/admin/coupons/CouponTable";
import { CouponModal } from "@/components/admin/coupons/CouponModal";
import { ConfirmModal } from "@/components/admin/coupons/ConfirmModal";
import { CreateCouponInput } from "./couponsService";
function TopBar({ count, onAdd }: { count: number; onAdd: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Quản lý Coupon
        </h1>{" "}
        <p className="text-slate-500 text-sm mt-1">
          Hiển thị {count} coupon
        </p>{" "}
      </div>{" "}
      <div className="flex items-center gap-2">
        {" "}
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors "
        >
          {" "}
          <span className="material-symbols-outlined text-sm">add</span> Thêm
          mới{" "}
        </button>{" "}
      </div>{" "}
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
      {" "}
      <span className="material-symbols-outlined">
        {toast.type === "success" ? "check_circle" : "error"}
      </span>{" "}
      {toast.message}{" "}
    </div>
  );
}
export default function AdminCouponsPage() {
  const { checkAuth } = useAuthStore();
  const s = useAdminCoupons();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  const { isAuthLoading, isAdmin } = s;
  if (!isAuthLoading && !isAdmin()) {
    notFound();
  }
  if (isAuthLoading) return null;
  const handleCreate = (data: CreateCouponInput) => s.mCreate.mutate(data);
  const handleUpdate = (data: CreateCouponInput) => {
    if (!s.editTarget) return;
    s.mUpdate.mutate({ id: s.editTarget._id, data });
  };
  const handleDelete = () => {
    if (!s.deleteTarget) return;
    s.mDelete.mutate(s.deleteTarget._id);
  };
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {" "}
      <TopBar
        count={s.coupons.length}
        onAdd={() => s.setShowCreate(true)}
      />{" "}
      <CouponTable
        coupons={s.coupons}
        isLoading={s.isLoading}
        onEdit={s.setEditTarget}
        onDelete={s.setDeleteTarget}
        page={s.page}
        totalPages={s.totalPages}
        onPageChange={s.setPage}
      />{" "}
      <ToastAlert toast={s.toast} />{" "}
      {s.showCreate && (
        <CouponModal
          title="Tạo mới"
          onClose={() => s.setShowCreate(false)}
          onSubmit={handleCreate}
          loading={s.mCreate.isPending}
        />
      )}{" "}
      {s.editTarget && (
        <CouponModal
          title="Sửa"
          initialData={s.editTarget}
          onClose={() => s.setEditTarget(null)}
          onSubmit={handleUpdate}
          loading={s.mUpdate.isPending}
        />
      )}{" "}
      {s.deleteTarget && (
        <ConfirmModal
          name={s.deleteTarget.code}
          onClose={() => s.setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={s.mDelete.isPending}
        />
      )}{" "}
    </div>
  );
}
