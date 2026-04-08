"use client";
interface Props {
  title?: string;
  message: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  color?: "red" | "purple" | "orange";
}
export function ConfirmModal({
  title = "Xác nhận",
  message,
  confirmLabel = "Xác nhận",
  onClose,
  onConfirm,
  loading,
  color = "red",
}: Props) {
  const colorMap = {
    red: {
      bg: "bg-red-100 text-red-600",
      btn: "bg-red-600 hover:bg-red-700",
      icon: "error",
    },
    purple: {
      bg: "bg-purple-100 text-purple-600",
      btn: "bg-purple-600 hover:bg-purple-700",
      icon: "autorenew",
    },
    orange: {
      bg: "bg-orange-100 text-orange-600",
      btn: "bg-orange-600 hover:bg-orange-700",
      icon: "cancel",
    },
  };
  const c = colorMap[color];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 flex flex-col items-center gap-4 text-center">
          <div
            className={`w-16 h-16 rounded-full ${c.bg} flex items-center justify-center`}
          >
            <span className="material-symbols-outlined text-4xl">
              {c.icon}
            </span>
          </div>
          {title && (
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          )}
          <p className="text-slate-500 text-sm leading-relaxed">
            {message}
          </p>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white ${c.btn} disabled:opacity-50 transition-colors flex items-center justify-center gap-2`}
          >
            {loading && (
              <span className="material-symbols-outlined text-sm animate-spin">
                progress_activity
              </span>
            )}
            {loading ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
