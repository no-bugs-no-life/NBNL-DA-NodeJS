"use client";
import {
  ReportItem,
  ReportStatus,
} from "@/app/admin/(protected)/reports/reportsService";
import { Pagination } from "@/components/ui/Pagination";
interface Props {
  reports: ReportItem[];
  isLoading: boolean;
  isFetching: boolean;
  onStatusChange: (report: ReportItem) => void;
  onDelete: (report: ReportItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}
const STATUS_CONFIG: Record<
  ReportStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Chờ duyệt", color: "text-amber-700", bg: "bg-amber-50" },
  reviewed: { label: "Đã xem", color: "text-blue-700", bg: "bg-blue-50" },
  resolved: {
    label: "Đã giải quyết",
    color: "text-green-700",
    bg: "bg-green-50",
  },
  dismissed: { label: "Bỏ qua", color: "text-slate-600", bg: "bg-slate-100" },
};
const TARGET_TYPE_CONFIG: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  app: { label: "App", icon: "apps", color: "text-purple-600" },
  review: { label: "Review", icon: "star", color: "text-orange-600" },
};
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function StatusBadge({ status }: { status: ReportStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}
    >
      {" "}
      <span className="material-symbols-outlined text-xs">
        {status === "resolved"
          ? "check_circle"
          : status === "dismissed"
            ? "cancel"
            : status === "reviewed"
              ? "visibility"
              : "schedule"}
      </span>{" "}
      {cfg.label}{" "}
    </span>
  );
}
function ActionButtons({
  report,
  onStatusChange,
  onDelete,
  showLabels = false,
}: {
  report: ReportItem;
  onStatusChange: (r: ReportItem) => void;
  onDelete: (r: ReportItem) => void;
  showLabels?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${showLabels ? "justify-start mt-2 pt-3 border-t border-slate-100 flex-wrap" : "justify-end"}`}
    >
      {" "}
      <button
        title="Xử lý"
        onClick={() => onStatusChange(report)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
      >
        {" "}
        <span className="material-symbols-outlined text-sm">
          edit_note
        </span>{" "}
        {showLabels && "Xử lý"}{" "}
      </button>{" "}
      <button
        title="Xóa"
        onClick={() => onDelete(report)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
      >
        {" "}
        <span className="material-symbols-outlined text-sm">delete</span>{" "}
        {showLabels && "Xóa"}{" "}
      </button>{" "}
    </div>
  );
}
export function ReportTable({
  reports,
  isLoading,
  isFetching,
  onStatusChange,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="bg-transparent md:bg-white md:rounded-2xl md:overflow-hidden">
      {" "}
      {/* Overlay khi fetching background */}{" "}
      {isFetching && !isLoading && (
        <div className="h-1 bg-blue-100">
          {" "}
          <div className="h-full bg-blue-500 animate-pulse w-1/3" />{" "}
        </div>
      )}{" "}
      {/* DESKTOP TABLE VIEW */}{" "}
      <div className="hidden md:block">
        {" "}
        <table className="w-full text-sm">
          {" "}
          <thead>
            {" "}
            <tr className="text-slate-500 bg-slate-50/50 border-b border-slate-100/50">
              {" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Người báo cáo
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Loại
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Lý do
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Trạng thái
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Ngày tạo
              </th>{" "}
              <th className="text-right px-6 py-4 font-semibold text-slate-600">
                Thao tác
              </th>{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody>
            {" "}
            {isLoading ? (
              <LoadingRows />
            ) : (
              <DataRows
                reports={reports}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            )}{" "}
          </tbody>{" "}
        </table>{" "}
      </div>{" "}
      {/* MOBILE CARDS VIEW */}{" "}
      <div className="block md:hidden space-y-4">
        {" "}
        {isLoading ? (
          <LoadingCards />
        ) : (
          <MobileCards
            reports={reports}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        )}{" "}
      </div>{" "}
      {!isLoading && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}{" "}
    </div>
  );
}
function LoadingRows() {
  return (
    <>
      {" "}
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-slate-50">
          {" "}
          <td colSpan={6} className="px-6 py-5">
            <div className="h-4 bg-slate-100 rounded w-full" />
          </td>{" "}
        </tr>
      ))}{" "}
    </>
  );
}
function LoadingCards() {
  return (
    <>
      {" "}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white p-4 rounded-xl border border-slate-100"
        >
          {" "}
          <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />{" "}
          <div className="h-3 bg-slate-100 rounded w-3/4 mb-2" />{" "}
          <div className="h-3 bg-slate-100 rounded w-1/3" />{" "}
        </div>
      ))}{" "}
    </>
  );
}
function MobileCards({
  reports,
  onStatusChange,
  onDelete,
}: {
  reports: ReportItem[];
  onStatusChange: (r: ReportItem) => void;
  onDelete: (r: ReportItem) => void;
}) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-xl">
        Chưa có report nào.
      </div>
    );
  }
  return (
    <>
      {" "}
      {reports.map((r) => {
        const targetCfg =
          TARGET_TYPE_CONFIG[r.targetType] || TARGET_TYPE_CONFIG.review;
        return (
          <div
            key={r._id}
            className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
          >
            {" "}
            <div className="flex items-start justify-between gap-2">
              {" "}
              <div className="flex-1 min-w-0">
                {" "}
                <p className="font-semibold text-slate-800 text-sm truncate">
                  {r.reporterId?.fullName || "Ẩn danh"}
                </p>{" "}
                <p className="text-xs text-slate-400">
                  {r.reporterId?.email || ""}
                </p>{" "}
              </div>{" "}
              <StatusBadge status={r.status} />{" "}
            </div>{" "}
            <div className="flex items-center gap-2 text-xs">
              {" "}
              <span
                className={`material-symbols-outlined text-sm ${targetCfg.color}`}
              >
                {targetCfg.icon}
              </span>{" "}
              <span className={`font-semibold ${targetCfg.color}`}>
                {targetCfg.label}
              </span>{" "}
              <span className="text-slate-400">•</span>{" "}
              <span className="text-slate-500">
                {formatDate(r.createdAt)}
              </span>{" "}
            </div>{" "}
            <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 line-clamp-2 italic">
              "{r.reason}"
            </p>{" "}
            {r.adminNote && (
              <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                {" "}
                <span className="font-semibold">Admin: </span>
                {r.adminNote}{" "}
              </p>
            )}{" "}
            <ActionButtons
              report={r}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              showLabels={true}
            />{" "}
          </div>
        );
      })}{" "}
    </>
  );
}
function DataRows({
  reports,
  onStatusChange,
  onDelete,
}: {
  reports: ReportItem[];
  onStatusChange: (r: ReportItem) => void;
  onDelete: (r: ReportItem) => void;
}) {
  if (reports.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-16 text-slate-400">
          Chưa có report nào.
        </td>
      </tr>
    );
  }
  return (
    <>
      {" "}
      {reports.map((r) => {
        const targetCfg =
          TARGET_TYPE_CONFIG[r.targetType] || TARGET_TYPE_CONFIG.review;
        return (
          <tr
            key={r._id}
            className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 group"
          >
            {" "}
            {/* Reporter */}{" "}
            <td className="px-6 py-4">
              {" "}
              <p className="font-semibold text-slate-800 text-sm">
                {r.reporterId?.fullName || "Ẩn danh"}
              </p>{" "}
              <p className="text-xs text-slate-400">
                {r.reporterId?.email || ""}
              </p>{" "}
            </td>{" "}
            {/* Target type */}{" "}
            <td className="px-6 py-4">
              {" "}
              <div className="flex items-center gap-1.5">
                {" "}
                <span
                  className={`material-symbols-outlined text-base ${targetCfg.color}`}
                >
                  {targetCfg.icon}
                </span>{" "}
                <span className={`text-sm font-semibold ${targetCfg.color}`}>
                  {targetCfg.label}
                </span>{" "}
              </div>{" "}
            </td>{" "}
            {/* Reason */}{" "}
            <td className="px-6 py-4 max-w-[240px]">
              {" "}
              <p className="text-xs text-slate-600 line-clamp-2 italic">
                "{r.reason}"
              </p>{" "}
              {r.adminNote && (
                <p className="text-[11px] text-blue-600 mt-1 truncate">
                  → {r.adminNote}
                </p>
              )}{" "}
            </td>{" "}
            {/* Status */}{" "}
            <td className="px-6 py-4">
              <StatusBadge status={r.status} />
            </td>{" "}
            {/* Date */}{" "}
            <td className="px-6 py-4 text-xs text-slate-500">
              {formatDate(r.createdAt)}
            </td>{" "}
            {/* Actions */}{" "}
            <td className="px-6 py-4 text-right">
              {" "}
              <ActionButtons
                report={r}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                showLabels={false}
              />{" "}
            </td>{" "}
          </tr>
        );
      })}{" "}
    </>
  );
}
