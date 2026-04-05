"use client";
import { useEffect } from "react";
import { useAdminAnalytics } from "@/hooks/useAnalytics";
import { AnalyticsTable } from "@/components/admin/analytics/AnalyticsTable";
import { AnalyticsModal } from "@/components/admin/analytics/AnalyticsModal";
import { ConfirmModal } from "@/components/admin/analytics/ConfirmModal";
import { useAdminApps } from "@/hooks/useAdminApps";
import { notFound, useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { AnalyticsUpdate } from "@/hooks/useAnalytics";

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined text-lg">{icon}</span>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-slate-800">
          {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
        </p>
      </div>
    </div>
  );
}

// ─── Filter Bar ────────────────────────────────────────────────────────────────

function FilterBar({
  appIdFilter,
  setAppIdFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  apps,
  onClear,
  hasFilters,
}: {
  appIdFilter: string;
  setAppIdFilter: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  apps: { _id: string; name: string }[];
  onClear: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3 mb-6">
      {/* App select */}
      <div className="min-w-[200px]">
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          App
        </label>
        <select
          value={appIdFilter}
          onChange={(e) => setAppIdFilter(e.target.value)}
          className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">Tất cả App</option>
          {apps.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Start date */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          Từ ngày
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* End date */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          Đến ngày
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined text-sm mr-1 align-text-bottom">
            clear
          </span>
          Xoá lọc
        </button>
      )}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function ToastAlert({
  toast,
}: {
  toast: { message: string; type: string } | null;
}) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      <span className="material-symbols-outlined">
        {toast.type === "success" ? "check_circle" : "error"}
      </span>
      {toast.message}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  const s = useAdminAnalytics();
  const apps = useAdminApps();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!s.isAuthLoading && !s.isAdmin()) {
    notFound();
  }

  if (s.isAuthLoading) return null;

  const hasFilters = !!(s.appIdFilter || s.startDate || s.endDate);

  return (
    <>
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
          <p className="text-slate-500 text-sm">
            {s.totalDocs > 0
              ? `Hiển thị ${s.totalDocs} bản ghi`
              : "Không có bản ghi nào"}
          </p>
        </div>
      </div>

      {/* ── Summary Stats (when app selected) ── */}
      {s.summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <SummaryCard
            label="Tổng Views"
            value={s.summary.totalViews}
            icon="visibility"
            color="bg-blue-50 text-blue-600"
          />
          <SummaryCard
            label="Tổng Downloads"
            value={s.summary.totalDownloads}
            icon="download"
            color="bg-green-50 text-green-600"
          />
          <SummaryCard
            label="Tổng Installs"
            value={s.summary.totalInstalls}
            icon="install_mobile"
            color="bg-emerald-50 text-emerald-600"
          />
          <SummaryCard
            label="AVG Rating"
            value={`★ ${s.summary.avgRating.toFixed(2)}`}
            icon="star"
            color="bg-amber-50 text-amber-600"
          />
          <SummaryCard
            label="AVG Active Users"
            value={Math.round(s.summary.avgActiveUsers)}
            icon="group"
            color="bg-violet-50 text-violet-600"
          />
          <SummaryCard
            label="Tổng Crashes"
            value={s.summary.totalCrashes}
            icon="bug_report"
            color={
              s.summary.totalCrashes > 0
                ? "bg-red-50 text-red-600"
                : "bg-slate-50 text-slate-400"
            }
          />
          <SummaryCard
            label="Số bản ghi"
            value={s.summary.recordCount}
            icon="insert_chart"
            color="bg-slate-50 text-slate-600"
          />
        </div>
      )}

      {/* ── Filter Bar ── */}
      <FilterBar
        appIdFilter={s.appIdFilter}
        setAppIdFilter={(v) => {
          s.setAppIdFilter(v);
          s.setPage(1);
        }}
        startDate={s.startDate}
        setStartDate={(v) => {
          s.setStartDate(v);
          s.setPage(1);
        }}
        endDate={s.endDate}
        setEndDate={(v) => {
          s.setEndDate(v);
          s.setPage(1);
        }}
        apps={apps.data ?? []}
        onClear={s.clearFilters}
        hasFilters={hasFilters}
      />

      {/* ── Table ── */}
      <AnalyticsTable
        records={s.records}
        isLoading={s.isLoading}
        onView={(r) => s.setDetailTarget(r)}
        onEdit={(r) => s.setEditTarget(r)}
        onDelete={(r) => s.setDeleteTarget(r)}
        page={s.page}
        totalPages={s.totalPages}
        onPageChange={s.setPage}
      />

      {/* ── Modals ── */}
      <ToastAlert toast={s.toast} />

      {/* Detail modal */}
      {s.detailTarget && (
        <AnalyticsModal
          record={s.detailTarget}
          mode="view"
          onClose={() => s.setDetailTarget(null)}
          onSubmit={() => {}}
        />
      )}

      {/* Edit modal */}
      {s.editTarget && (
        <AnalyticsModal
          record={s.editTarget}
          mode="edit"
          onClose={() => s.setEditTarget(null)}
          onSubmit={(data: AnalyticsUpdate) =>
            s.mUpdate.mutate({ id: s.editTarget!._id, data })
          }
          loading={s.mUpdate.isPending}
        />
      )}

      {/* Delete confirm modal */}
      {s.deleteTarget && (
        <ConfirmModal
          recordName={
            `${s.deleteTarget.appId?.name ?? "—"} · ${new Date(s.deleteTarget.date).toLocaleDateString("vi-VN")}`
          }
          onClose={() => s.setDeleteTarget(null)}
          onConfirm={() => s.mDelete.mutate(s.deleteTarget!._id)}
          loading={s.mDelete.isPending}
        />
      )}
    </>
  );
}
