"use client";
import { ReviewItem } from "@/app/admin/(protected)/reviews/reviewsService";
interface Props {
  review: ReviewItem;
  action: "approve" | "reject" | "delete" | "reset";
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const ICON_PATHS: Record<Props["action"], string> = {
  approve: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  reject: "M6 18 18 6M6 6l12 12",
  reset: "M9 15 3 9m0 0 3-3m-3 3V4",
  delete:
    "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0",
};
const ICON_BG: Record<Props["action"], string> = {
  approve: "bg-green-100",
  reject: "bg-red-100",
  reset: "bg-amber-100",
  delete: "bg-red-100",
};
const BTN_CLASS: Record<Props["action"], string> = {
  approve: "bg-green-600 hover:bg-green-700",
  reject: "bg-red-600 hover:bg-red-700",
  reset: "bg-amber-600 hover:bg-amber-700",
  delete: "bg-red-600 hover:bg-red-700",
};
const BTN_TEXT: Record<Props["action"], string> = {
  approve: "Duyệt",
  reject: "Tu choi",
  reset: "Chuyển về chờ",
  delete: "Xoá",
};
const TITLE: Record<Props["action"], string> = {
  approve: "Duyet Đánh giá",
  reject: "Tu choi Đánh giá",
  reset: "Chuyển về Chờ duyệt",
  delete: "Xác nhận xoá",
};
export function ConfirmReviewModal({
  review,
  action,
  onClose,
  onConfirm,
  loading,
}: Props) {
  const iconPath = ICON_PATHS[action];
  const iconBg = ICON_BG[action];
  const btnClass = BTN_CLASS[action];
  const btnText = BTN_TEXT[action];
  const title = TITLE[action];
  const messages: Record<Props["action"], string> = {
    approve: `Ban co chac chan muon duyet đánh giá của "${review.userId.fullName}" cho ung dung "${review.appId.name}"?`,
    reject: `Ban co chac chan muon tu choi đánh giá của "${review.userId.fullName}"?`,
    reset: `Ban co chac chan muon chuyển đánh giá của "${review.userId.fullName}" ve trạng thái chờ duyệt?`,
    delete: `Ban co chac chan muon xoa đánh giá của "${review.userId.fullName}"? Hanh dong khong the hoan tac.`,
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      {" "}
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        {" "}
        {/* Header */}{" "}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          {" "}
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>{" "}
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />{" "}
            </svg>{" "}
          </button>{" "}
        </div>{" "}
        {/* Body */}{" "}
        <div className="p-6 flex flex-col items-center text-center gap-4">
          {" "}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${iconBg}`}
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-current"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={iconPath}
              />{" "}
            </svg>{" "}
          </div>{" "}
          <p className="text-sm text-slate-500">{messages[action]}</p>{" "}
        </div>{" "}
        {/* Footer */}{" "}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          {" "}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
          >
            {" "}
            Huy{" "}
          </button>{" "}
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${btnClass}`}
          >
            {" "}
            {loading && (
              <svg
                className="w-4 h-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                {" "}
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />{" "}
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
                />{" "}
              </svg>
            )}{" "}
            {btnText}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
