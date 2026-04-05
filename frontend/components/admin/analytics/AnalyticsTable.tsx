"use client";
import { AnalyticsRecord } from "@/hooks/useAnalytics";
import { Pagination } from "@/components/ui/Pagination";

interface Props {
  records: AnalyticsRecord[];
  isLoading: boolean;
  onView: (record: AnalyticsRecord) => void;
  onEdit: (record: AnalyticsRecord) => void;
  onDelete: (record: AnalyticsRecord) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function StatChip({
  label,
  value,
  color = "slate",
}: {
  label: string;
  value: number;
  color?: "slate" | "blue" | "green" | "red" | "amber";
}) {
  const map = {
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded ${map[color]}`}
      title={label}
    >
      {value.toLocaleString("vi-VN")}
    </span>
  );
}

export function AnalyticsTable({
  records,
  isLoading,
  onView,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="bg-transparent md:bg-white md:rounded-2xl md:overflow-hidden">
      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 bg-slate-50/50 border-b border-slate-100/50">
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                App
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Ngày
              </th>
              <th className="text-right px-6 py-4 font-semibold text-slate-600">
                Views
              </th>
              <th className="text-right px-6 py-4 font-semibold text-slate-600">
                Downloads
              </th>
              <th className="text-right px-6 py-4 font-semibold text-slate-600">
                Installs
              </th>
              <th className="text-right px-6 py-4 font-semibold text-slate-600">
                Active Users
              </th>
              <th className="text-right px-6 py-4 font-semibold text-slate-600">
                Rating
              </th>
              <th className="text-right px-6 py-4 font-semibold text-slate-600">
                Crashes
              </th>
              <th className="text-right px-6 py-4 font-semibold text-slate-600">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingRows />
            ) : (
              <DataRows
                records={records}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="block md:hidden space-y-4">
        {isLoading ? (
          <LoadingCards />
        ) : (
          <MobileCards
            records={records}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>

      {!isLoading && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-slate-50">
          <td colSpan={9} className="px-6 py-4">
            <div className="h-4 bg-slate-100 rounded w-full" />
          </td>
        </tr>
      ))}
    </>
  );
}

function LoadingCards() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white p-4 rounded-xl border border-slate-100"
        >
          <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
          <div className="h-3 bg-slate-100 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-1/4" />
        </div>
      ))}
    </>
  );
}

function RowActions({
  record,
  onView,
  onEdit,
  onDelete,
  showLabels,
}: {
  record: AnalyticsRecord;
  onView: (r: AnalyticsRecord) => void;
  onEdit: (r: AnalyticsRecord) => void;
  onDelete: (r: AnalyticsRecord) => void;
  showLabels?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${showLabels ? "justify-start mt-2 border-t border-slate-50 pt-3 flex-wrap" : "justify-end"}`}
    >
      <button
        title="Chi tiết"
        onClick={() => onView(record)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">info</span>
        {showLabels && "Chi tiết"}
      </button>
      <button
        title="Sửa"
        onClick={() => onEdit(record)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">edit</span>
        {showLabels && "Sửa"}
      </button>
      <button
        title="Xóa"
        onClick={() => onDelete(record)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
        {showLabels && "Xóa"}
      </button>
    </div>
  );
}

function MobileCards({
  records,
  onView,
  onEdit,
  onDelete,
}: {
  records: AnalyticsRecord[];
  onView: (r: AnalyticsRecord) => void;
  onEdit: (r: AnalyticsRecord) => void;
  onDelete: (r: AnalyticsRecord) => void;
}) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-xl">
        Chưa có bản ghi analytics nào.
      </div>
    );
  }
  return (
    <>
      {records.map((r) => (
        <div
          key={r._id}
          className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-slate-800 truncate leading-tight">
                {r.appId?.name ?? "—"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatDate(r.date)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatChip label="Views" value={r.views} color="blue" />
            <StatChip label="Downloads" value={r.downloads} color="green" />
            <StatChip label="Installs" value={r.installs} color="slate" />
            <StatChip label="Active Users" value={r.activeUsers} color="amber" />
            <StatChip
              label="Rating"
              value={r.ratingAverage}
              color="slate"
            />
            <StatChip label="Crashes" value={r.crashCount} color="red" />
          </div>
          <RowActions
            record={r}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            showLabels
          />
        </div>
      ))}
    </>
  );
}

function DataRows({
  records,
  onView,
  onEdit,
  onDelete,
}: {
  records: AnalyticsRecord[];
  onView: (r: AnalyticsRecord) => void;
  onEdit: (r: AnalyticsRecord) => void;
  onDelete: (r: AnalyticsRecord) => void;
}) {
  if (records.length === 0) {
    return (
      <tr>
        <td colSpan={9} className="text-center py-16 text-slate-400">
          Chưa có bản ghi analytics nào.
        </td>
      </tr>
    );
  }
  return (
    <>
      {records.map((r) => (
        <tr
          key={r._id}
          className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50"
        >
          {/* App */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              {r.appId?.iconUrl ? (
                <img
                  src={r.appId.iconUrl}
                  alt={r.appId.name}
                  className="w-8 h-8 rounded-lg object-cover bg-slate-100"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-base">
                    apps
                  </span>
                </div>
              )}
              <span className="font-semibold text-slate-800 text-sm truncate max-w-[160px]">
                {r.appId?.name ?? "—"}
              </span>
            </div>
          </td>
          {/* Date */}
          <td className="px-6 py-4 text-slate-600 text-xs whitespace-nowrap">
            {formatDate(r.date)}
          </td>
          {/* Views */}
          <td className="px-6 py-4 text-right text-slate-700 font-medium">
            {r.views.toLocaleString("vi-VN")}
          </td>
          {/* Downloads */}
          <td className="px-6 py-4 text-right text-slate-700 font-medium">
            {r.downloads.toLocaleString("vi-VN")}
          </td>
          {/* Installs */}
          <td className="px-6 py-4 text-right text-slate-700 font-medium">
            {r.installs.toLocaleString("vi-VN")}
          </td>
          {/* Active Users */}
          <td className="px-6 py-4 text-right text-slate-700 font-medium">
            {r.activeUsers.toLocaleString("vi-VN")}
          </td>
          {/* Rating */}
          <td className="px-6 py-4 text-right">
            <span className="text-amber-600 font-semibold">
              ★ {r.ratingAverage.toFixed(1)}
            </span>
          </td>
          {/* Crashes */}
          <td className="px-6 py-4 text-right">
            {r.crashCount > 0 ? (
              <span className="text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded text-xs">
                {r.crashCount}
              </span>
            ) : (
              <span className="text-slate-300">0</span>
            )}
          </td>
          {/* Actions */}
          <td className="px-6 py-4 text-right">
            <RowActions
              record={r}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </td>
        </tr>
      ))}
    </>
  );
}
