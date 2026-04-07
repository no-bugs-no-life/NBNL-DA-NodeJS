"use client";
import { AppTable } from "@/components/admin/apps/AppTable";
import { ConfirmAppModal } from "@/components/admin/apps/ConfirmAppModal";
import { AppFormModal } from "@/components/admin/apps/AppFormModal";
import { useAdminApps } from "./useAdminApps";
import { useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

function TopBar({
  count,
  filterStatus,
  setFilterStatus,
  onAddClick,
  onRefresh,
  isFetching,
}: {
  count: number;
  filterStatus: string;
  setFilterStatus: (s: string) => void;
  onAddClick: () => void;
  onRefresh: () => void;
  isFetching?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Quản lý App</h1>
        <p className="text-slate-500 text-sm">Hiển thị {count} ứng dụng</p>
      </div>
      <div className="flex flex-col xl:flex-row xl:items-center gap-3">
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200 overflow-x-auto whitespace-nowrap hide-scrollbar max-w-full">
          {[
            { id: "all", label: "Tất cả" },
            { id: "published", label: "Đã phát hành" },
            { id: "pending", label: "Chờ duyệt" },
            { id: "approved", label: "Đã duyệt" },
            { id: "rejected", label: "Từ chối" },
            { id: "deleted", label: "Đã xóa" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${filterStatus === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isFetching}
            className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
            title="Làm mới"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${isFetching ? "animate-spin text-blue-600" : ""}`}
            >
              refresh
            </span>
          </button>
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span> Thêm
            mới
          </button>
        </div>
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
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      <span className="material-symbols-outlined">
        {toast.type === "success" ? "check_circle" : "error"}
      </span>{" "}
      {toast.message}
    </div>
  );
}

export default function AdminAppsPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  const s = useAdminApps();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!s.isAuthLoading && !s.isAdmin()) {
    notFound();
  }

  if (s.isAuthLoading) return null;

  return (
    <>
      <TopBar
        count={s.totalDocs}
        filterStatus={s.filterStatus}
        setFilterStatus={(status) => {
          s.setFilterStatus(status);
          s.setPage(1);
        }}
        onAddClick={() => s.setFormTarget({ action: "create" })}
        onRefresh={s.refetch}
        isFetching={s.isFetching}
      />
      <AppTable
        apps={s.apps}
        isLoading={s.isLoading}
        onAction={(app, action) => {
          if (action === "info") router.push(`/admin/apps/${app._id}`);
          else if (action === "edit") s.setFormTarget({ app, action });
          else
            s.setActionTarget({
              app,
              action: action as "approve" | "reject" | "delete" | "publish",
            });
        }}
        page={s.page}
        totalPages={s.totalPages}
        onPageChange={s.setPage}
      />
      <ToastAlert toast={s.toast} />

      {s.actionTarget && (
        <ConfirmAppModal
          app={s.actionTarget.app}
          action={s.actionTarget.action}
          onClose={() => s.setActionTarget(null)}
          onConfirm={() => {
            if (s.actionTarget?.action === "approve")
              s.mApprove.mutate(s.actionTarget.app._id);
            if (s.actionTarget?.action === "reject")
              s.mReject.mutate(s.actionTarget.app._id);
            if (s.actionTarget?.action === "publish")
              s.mPublish.mutate(s.actionTarget.app._id);
            if (s.actionTarget?.action === "delete")
              s.mDelete.mutate(s.actionTarget.app._id);
          }}
          loading={
            s.mApprove.isPending ||
            s.mReject.isPending ||
            s.mPublish.isPending ||
            s.mDelete.isPending
          }
        />
      )}

      {s.formTarget && (
        <AppFormModal
          app={s.formTarget.app}
          action={s.formTarget.action}
          onClose={() => s.setFormTarget(null)}
          onSubmit={(data) => {
            if (s.formTarget?.action === "create") s.mCreate.mutate(data);
            else if (s.formTarget?.action === "edit" && s.formTarget.app)
              s.mUpdate.mutate({ id: s.formTarget.app._id, data });
          }}
          loading={s.mCreate.isPending || s.mUpdate.isPending}
        />
      )}
    </>
  );
}
