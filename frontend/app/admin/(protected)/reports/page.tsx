"use client";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { useAdminReports } from "./useAdminReports";
import { ReportTable } from "@/components/admin/reports/ReportTable";
import { ReportCreateModal } from "@/components/admin/reports/ReportCreateModal";
import { ReportStatusModal } from "@/components/admin/reports/ReportStatusModal";
import { ConfirmModal } from "@/components/admin/reports/ConfirmModal";
import { ReportStatus } from "./reportsService";

function TopBar({ count, onAdd }: { count: number; onAdd: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Quản lý Reports
        </h1>
        <p className="text-slate-500 text-sm mt-1">Hiển thị {count} report</p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-sm">add</span> Tạo
        Report
      </button>
    </div>
  );
}

function FilterBar({
  statusFilter,
  setStatusFilter,
  targetTypeFilter,
  setTargetTypeFilter,
}: {
  statusFilter: string;
  setStatusFilter: (v: ReportStatus | "") => void;
  targetTypeFilter: string;
  setTargetTypeFilter: (v: "app" | "review" | "") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as ReportStatus | "")}
        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="pending">Chờ duyệt</option>
        <option value="reviewed">Đã xem</option>
        <option value="resolved">Đã giải quyết</option>
        <option value="dismissed">Bỏ qua</option>
      </select>

      <select
        value={targetTypeFilter}
        onChange={(e) =>
          setTargetTypeFilter(e.target.value as "app" | "review" | "")
        }
        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="">Tất cả loại</option>
        <option value="app">App</option>
        <option value="review">Review</option>
      </select>
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
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      <span className="material-symbols-outlined">
        {toast.type === "success" ? "check_circle" : "error"}
      </span>
      {toast.message}
    </div>
  );
}

export default function AdminReportsPage() {
  const { checkAuth } = useAuthStore();
  const s = useAdminReports();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const { isAuthLoading, isAdmin } = s;

  if (!isAuthLoading && !isAdmin()) {
    notFound();
  }

  if (isAuthLoading) return null;

  const handleStatusSubmit = (status: ReportStatus, adminNote: string) => {
    if (!s.actionTarget) return;
    s.mUpdateStatus.mutate({ id: s.actionTarget._id, status, adminNote });
  };

  const handleDelete = () => {
    if (!s.deleteTarget) return;
    s.mDelete.mutate(s.deleteTarget._id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <TopBar count={s.totalDocs} onAdd={() => s.setShowCreate(true)} />
      <FilterBar
        statusFilter={s.statusFilter}
        setStatusFilter={s.setStatusFilter}
        targetTypeFilter={s.targetTypeFilter}
        setTargetTypeFilter={s.setTargetTypeFilter}
      />
      <ReportTable
        reports={s.reports}
        isLoading={s.isLoading}
        isFetching={s.isFetching}
        onStatusChange={s.setActionTarget}
        onDelete={s.setDeleteTarget}
        page={s.page}
        totalPages={s.totalPages}
        onPageChange={s.setPage}
      />
      <ToastAlert toast={s.toast} />

      {s.showCreate && (
        <ReportCreateModal
          onClose={() => s.setShowCreate(false)}
          onSubmit={(data) => s.mCreate.mutate(data)}
          loading={s.mCreate.isPending}
        />
      )}
      {s.actionTarget && (
        <ReportStatusModal
          reportCode={s.actionTarget._id}
          currentStatus={s.actionTarget.status}
          currentNote={s.actionTarget.adminNote}
          onClose={() => s.setActionTarget(null)}
          onSubmit={handleStatusSubmit}
          loading={s.mUpdateStatus.isPending}
        />
      )}
      {s.deleteTarget && (
        <ConfirmModal
          name={`Report #${s.deleteTarget._id.slice(-8)}`}
          onClose={() => s.setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={s.mDelete.isPending}
        />
      )}
    </div>
  );
}
