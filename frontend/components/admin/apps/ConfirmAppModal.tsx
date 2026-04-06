"use client";
import { AppItem } from "@/app/admin/(protected)/apps/appsService";

interface Props {
  app: AppItem;
  action: "approve" | "reject" | "delete" | "publish";
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function ConfirmAppModal({
  app,
  action,
  onClose,
  onConfirm,
  loading,
}: Props) {
  let title = "";
  let message = "";
  let btnClass = "";
  let btnText = "";

  if (action === "approve") {
    title = "Duyệt Ứng dụng";
    message = `Bạn có chắc chắn muốn duyệt và phát hành ứng dụng "${app.name}" không?`;
    btnClass = "bg-green-600 hover:bg-green-700 text-white";
    btnText = "Duyệt ứng dụng";
  } else if (action === "reject") {
    title = "Từ chối Ứng dụng";
    message = `Bạn có chắc chắn muốn từ chối ứng dụng "${app.name}" không? Ứng dụng sẽ bị đánh dấu là đã từ chối.`;
    btnClass = "bg-amber-600 hover:bg-amber-700 text-white";
    btnText = "Từ chối";
  } else if (action === "publish") {
    title = "Phát hành Ứng dụng";
    message = `Bạn có chắc chắn muốn xuất bản ứng dụng "${app.name}" để hiển thị công khai trên Store không?`;
    btnClass = "bg-purple-600 hover:bg-purple-700 text-white";
    btnText = "Xuất bản";
  } else {
    title = "Xác nhận xoá";
    message = `Bạn có chắc chắn muốn xoá ứng dụng "${app.name}" không? Hành động này không thể hoàn tác.`;
    btnClass = "bg-red-600 hover:bg-red-700 text-white";
    btnText = "Xoá ứng dụng";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
          <p className="text-slate-500 text-sm">{message}</p>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 ${btnClass}`}
          >
            {loading && (
              <span className="material-symbols-outlined animate-spin text-sm">
                progress_activity
              </span>
            )}
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
}
