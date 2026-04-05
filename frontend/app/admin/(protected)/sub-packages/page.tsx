"use client";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { useAdminSubPackages } from "./useAdminSubPackages";
import { SubPackageTable } from "@/components/admin/sub-packages/SubPackageTable";
import { SubPackageModal } from "@/components/admin/sub-packages/SubPackageModal";
import { ConfirmModal } from "@/components/admin/sub-packages/ConfirmModal";
function TopBar({ count, onAdd }: { count: number; onAdd: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Quản lý Gói Subscription
        </h1>{" "}
        <p className="text-slate-500 text-sm mt-1">Hiển thị {count} gói</p>{" "}
      </div>{" "}
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
      >
        {" "}
        <span className="material-symbols-outlined text-sm">add</span> Tạo gói
        mới{" "}
      </button>{" "}
    </div>
  );
}
function TypeFilterBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "", label: "Tất cả" },
    { value: "monthly", label: "Hàng tháng" },
    { value: "yearly", label: "Hàng năm" },
    { value: "lifetime", label: "Vĩnh viễn" },
  ];
  return (
    <div className="flex items-center gap-3">
      {" "}
      <span className="text-sm font-semibold text-slate-500">Lọc:</span>{" "}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
        {" "}
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${value === opt.value ? "bg-white text-slate-800 " : "text-slate-500 hover:text-slate-700"}`}
          >
            {" "}
            {opt.label}{" "}
          </button>
        ))}{" "}
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
export default function AdminSubPackagesPage() {
  const { checkAuth } = useAuthStore();
  const s = useAdminSubPackages();
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
      {" "}
      <TopBar
        count={s.packages.length}
        onAdd={() => s.setShowCreate(true)}
      />{" "}
      <TypeFilterBar value={s.typeFilter} onChange={s.setTypeFilter} />{" "}
      <SubPackageTable
        packages={s.packages}
        isLoading={s.isLoading}
        onEdit={s.setEditTarget}
        onDelete={s.setDeleteTarget}
        page={s.page}
        totalPages={s.totalPages}
        onPageChange={s.setPage}
      />{" "}
      {/* Create modal */}{" "}
      {s.showCreate && (
        <SubPackageModal
          onClose={() => s.setShowCreate(false)}
          onSubmit={(data) =>
            s.mCreate.mutate(data as Parameters<typeof s.mCreate.mutate>[0])
          }
          loading={s.mCreate.isPending}
        />
      )}{" "}
      {/* Edit modal */}{" "}
      {s.editTarget && (
        <SubPackageModal
          initialData={s.editTarget}
          onClose={() => s.setEditTarget(null)}
          onSubmit={(data) => s.mUpdate.mutate({ id: s.editTarget!._id, data })}
          loading={s.mUpdate.isPending}
        />
      )}{" "}
      {/* Delete confirm */}{" "}
      {s.deleteTarget && (
        <ConfirmModal
          title="Xóa gói Subscription"
          message={`Bạn có chắc muốn xóa gói "${s.deleteTarget.name}" không?`}
          confirmLabel="Xóa"
          onClose={() => s.setDeleteTarget(null)}
          onConfirm={() => s.mDelete.mutate(s.deleteTarget!._id)}
          loading={s.mDelete.isPending}
        />
      )}{" "}
      <ToastAlert toast={s.toast} />{" "}
    </div>
  );
}
