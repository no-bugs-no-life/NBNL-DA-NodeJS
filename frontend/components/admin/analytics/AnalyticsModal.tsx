"use client";
import { useEffect, useState } from "react";
import { AnalyticsRecord, AnalyticsUpdate } from "@/hooks/useAnalytics";

interface Props {
  record: AnalyticsRecord | null;
  mode: "view" | "edit";
  onClose: () => void;
  onSubmit: (data: AnalyticsUpdate) => void;
  loading?: boolean;
}

function num(v?: number) {
  return v ?? 0;
}

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function AnalyticsModal({
  record,
  mode,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const [form, setForm] = useState<AnalyticsUpdate>({});

  useEffect(() => {
    if (record) {
      setForm({
        views: record.views,
        downloads: record.downloads,
        installs: record.installs,
        activeUsers: record.activeUsers,
        ratingAverage: record.ratingAverage,
        crashCount: record.crashCount,
      });
    }
  }, [record]);

  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {mode === "view" ? "Chi tiết Analytics" : "Chỉnh sửa Analytics"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {record.appId?.name ?? "—"} · {formatDate(record.date)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-slate-400">
              close
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {mode === "view" ? (
            <ViewBody record={record} />
          ) : (
            <form
              id="analytics-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <NumberField
                label="Views"
                value={form.views ?? 0}
                onChange={(v) => setForm((f) => ({ ...f, views: v }))}
              />
              <NumberField
                label="Downloads"
                value={form.downloads ?? 0}
                onChange={(v) => setForm((f) => ({ ...f, downloads: v }))}
              />
              <NumberField
                label="Installs"
                value={form.installs ?? 0}
                onChange={(v) => setForm((f) => ({ ...f, installs: v }))}
              />
              <NumberField
                label="Active Users"
                value={form.activeUsers ?? 0}
                onChange={(v) => setForm((f) => ({ ...f, activeUsers: v }))}
              />
              <NumberField
                label="Rating (0–5)"
                value={form.ratingAverage ?? 0}
                min={0}
                max={5}
                step={0.1}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    ratingAverage: Math.min(5, Math.max(0, v)),
                  }))
                }
              />
              <NumberField
                label="Crash Count"
                value={form.crashCount ?? 0}
                min={0}
                onChange={(v) => setForm((f) => ({ ...f, crashCount: v }))}
              />
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>
          {mode === "edit" && (
            <button
              type="submit"
              form="analytics-form"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── View body ────────────────────────────────────────────────────────────────

function ViewBody({ record }: { record: AnalyticsRecord }) {
  const stats = [
    {
      label: "Views",
      value: record.views,
      icon: "visibility",
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Downloads",
      value: record.downloads,
      icon: "download",
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Installs",
      value: record.installs,
      icon: "install_mobile",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Active Users",
      value: record.activeUsers,
      icon: "group",
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Rating",
      value: record.ratingAverage,
      icon: "star",
      color: "text-yellow-600 bg-yellow-50",
      suffix: "/5",
    },
    {
      label: "Crashes",
      value: record.crashCount,
      icon: "bug_report",
      color:
        record.crashCount > 0
          ? "text-red-600 bg-red-50"
          : "text-slate-400 bg-slate-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-2 p-4 rounded-xl bg-slate-50 border border-slate-100"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {s.label}
            </span>
            <span
              className={`material-symbols-outlined text-sm ${s.color.split(" ")[0]}`}
            >
              {s.icon}
            </span>
          </div>
          <p className={`text-xl font-bold ${s.color.split(" ")[0]}`}>
            {typeof s.value === "number"
              ? s.value.toLocaleString("vi-VN")
              : s.value}
            {s.suffix && (
              <span className="text-sm font-normal text-slate-400 ml-0.5">
                {s.suffix}
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Edit form number field ──────────────────────────────────────────────────

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-1.5">
        {label}
      </label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>
  );
}
