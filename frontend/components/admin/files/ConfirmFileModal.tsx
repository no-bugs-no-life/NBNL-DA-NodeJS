"use client";
import { FileItem } from "@/hooks/useFiles";
interface Props {
  file: FileItem;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}
export function ConfirmFileModal({ file, onClose, onConfirm, loading }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      {" "}
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        {" "}
        {/* Header */}{" "}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          {" "}
          <h2 className="text-xl font-bold text-slate-800">
            Xác nhận xoá
          </h2>{" "}
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
        <div className="p-6 flex flex-col items-center text-center gap-3">
          {" "}
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />{" "}
            </svg>{" "}
          </div>{" "}
          <p className="text-sm text-slate-500">
            {" "}
            Ban co chac muon xoa file{" "}
            <span className="font-semibold text-slate-700">
              "{file.fileType.toUpperCase()}"
            </span>
            ? Hanh dong khong the hoan tac.{" "}
          </p>{" "}
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
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
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
            {loading ? "Dang xoa..." : "Xoa"}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
