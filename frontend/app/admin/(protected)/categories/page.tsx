"use client";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { CategoryModal } from "@/components/admin/categories/CategoryModal";
import { ConfirmModal } from "@/components/admin/categories/ConfirmModal";
import { useAdminCategories } from "./useAdminCategories";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

function TopBar({ count, onAdd }: { count: number, onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Quản lý Danh mục</h1>
        <p className="text-slate-500 text-sm">{count} danh mục</p>
      </div>
      <button onClick={onAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm">
        <span className="material-symbols-outlined text-base">add</span> Thêm danh mục
      </button>
    </div>
  );
}

function ToastAlert({ toast }: { toast: { message: string, type: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
      <span className="material-symbols-outlined">{toast.type === "success" ? "check_circle" : "error"}</span> {toast.message}
    </div>
  );
}

export default function AdminCategoriesPage() {
  const { checkAuth } = useAuthStore();
  const s = useAdminCategories();

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const { isAuthLoading, isAdmin } = s;

  if (!isAuthLoading && !isAdmin()) {
    notFound();
  }

  if (isAuthLoading) return null;

  return (
    <>
      <TopBar count={s.categories.length} onAdd={() => s.setShowCreate(true)} />
      <CategoryTable categories={s.categories} isLoading={s.isLoading} onEdit={s.setEditTarget} onDelete={s.setDeleteTarget} />
      <ToastAlert toast={s.toast} />

      {s.showCreate && <CategoryModal title="Tạo mới" onClose={() => s.setShowCreate(false)} onSubmit={(name: string, iconUrl?: string) => s.mCreate.mutate({ name, iconUrl })} loading={s.mCreate.isPending} />}
      {s.editTarget && <CategoryModal title="Sửa" initialName={s.editTarget.name} initialIconUrl={s.editTarget.iconUrl} onClose={() => s.setEditTarget(null)} onSubmit={(n: string, iu?: string) => s.mUpdate.mutate({ id: s.editTarget!._id, name: n, iconUrl: iu })} loading={s.mUpdate.isPending} />}
      {s.deleteTarget && <ConfirmModal name={s.deleteTarget.name} onClose={() => s.setDeleteTarget(null)} onConfirm={() => s.mDelete.mutate(s.deleteTarget!._id)} loading={s.mDelete.isPending} />}
    </>
  );
}
