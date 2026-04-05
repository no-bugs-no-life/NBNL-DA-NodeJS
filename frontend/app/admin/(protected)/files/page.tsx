"use client";
import { FileTable } from "@/components/admin/files/FileTable";
import { FileUploadModal } from "@/components/admin/files/FileUploadModal";
import { ConfirmFileModal } from "@/components/admin/files/ConfirmFileModal";
import { FileFilterBar } from "@/components/admin/files/FileFilterBar";
import { useAdminFiles } from "./useAdminFiles";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
function TopBar({ count, onAdd }: { count: number; onAdd: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Quản lý Files
        </h1>{" "}
        <p className="text-slate-500 text-sm mt-1">
          Hiển thị {count} file(s)
        </p>{" "}
      </div>{" "}
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors "
      >
        {" "}
        <span className="material-symbols-outlined text-sm">add</span> Thêm
        mới{" "}
      </button>{" "}
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
export default function AdminFilesPage() {
  const { checkAuth } = useAuthStore();
  const s = useAdminFiles();
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
      <TopBar count={s.files.length} onAdd={() => s.setShowCreate(true)} />{" "}
      <FileFilterBar
        ownerType={s.ownerTypeFilter}
        fileType={s.fileTypeFilter}
        onOwnerTypeChange={s.setOwnerTypeFilter}
        onFileTypeChange={s.setFileTypeFilter}
      />{" "}
      <FileTable
        files={s.files}
        isLoading={s.isLoading}
        onEdit={s.setEditTarget}
        onDelete={s.setDeleteTarget}
        page={s.page}
        totalPages={s.totalPages}
        onPageChange={s.setPage}
      />{" "}
      {s.deleteTarget && (
        <ConfirmFileModal
          file={s.deleteTarget}
          onClose={() => s.setDeleteTarget(null)}
          onConfirm={() => s.mDelete.mutate(s.deleteTarget!._id)}
          loading={s.mDelete.isPending}
        />
      )}{" "}
      {s.showCreate && (
        <FileUploadModal
          onClose={() => s.setShowCreate(false)}
          onSubmit={(payload) => s.mCreate.mutate(payload)}
          loading={s.mCreate.isPending}
        />
      )}{" "}
      <ToastAlert toast={s.toast} />{" "}
    </div>
  );
}
