"use client";
import { useState } from "react";
import { ReportStatus } from "@/app/admin/(protected)/reports/reportsService";
interface ModalProps {
  reportCode: string;
  currentStatus: ReportStatus;
  currentNote: string;
  onClose: () => void;
  onSubmit: (status: ReportStatus, adminNote: string) => void;
  loading?: boolean;
}
const STATUS_OPTIONS: { value: ReportStatus; label: string; color: string }[] =
  [
    {
      value: "pending",
      label: "Chờ duyệt",
      color: "bg-amber-100 text-amber-700",
    },
    { value: "reviewed", label: "Đã xem", color: "bg-blue-100 text-blue-700" },
    {
      value: "resolved",
      label: "Đã giải quyết",
      color: "bg-green-100 text-green-700",
    },
    {
      value: "dismissed",
      label: "Bỏ qua",
      color: "bg-slate-100 text-slate-600",
    },
  ];
export function ReportStatusModal({
  reportCode,
  currentStatus,
  currentNote,
  onClose,
  onSubmit,
  loading,
}: ModalProps) {
  const [status, setStatus] = useState<ReportStatus>(currentStatus);
  const [adminNote, setAdminNote] = useState(currentNote || "");
  const handleSubmit = () => {
    onSubmit(status, adminNote);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Xử lý Report
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              #{reportCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">
              close
            </span>
          </button>
        </div>
        <div className="space-y-4">
          {/* Status selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Trạng thái xử lý
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${status === opt.value ? `${opt.color} border-current opacity-100` : "bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {/* Admin note */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Ghi chú Admin
              <span className="text-slate-400 font-normal">
                (tuỳ chọn)
              </span>
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Nhận xét hoặc lý do xử lý..."
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              (status === currentStatus && adminNote === (currentNote || ""))
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
