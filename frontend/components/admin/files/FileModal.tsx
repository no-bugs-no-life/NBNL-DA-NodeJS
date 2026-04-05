"use client";
import { useState } from "react";
import { FileItem } from "@/hooks/useFiles";
const FILE_TYPES = [
  "apk",
  "ipa",
  "icon",
  "banner",
  "screenshot",
  "avatar",
  "other",
] as const;
const OWNER_TYPES = ["app", "user", "developer"] as const;
interface Props {
  title: string;
  onClose: () => void;
  onSubmit: (data: {
    fileType: string;
    ownerType: string;
    url: string;
  }) => void;
  initialData?: Partial<FileItem>;
  loading?: boolean;
}
export function FileModal({
  title,
  onClose,
  onSubmit,
  initialData,
  loading,
}: Props) {
  const [fileType, setFileType] = useState(initialData?.fileType ?? "other");
  const [ownerType, setOwnerType] = useState(initialData?.ownerType ?? "user");
  const [url, setUrl] = useState(initialData?.url ?? "");
  const handleSubmit = () => {
    if (!url.trim()) return;
    onSubmit({ fileType, ownerType, url: url.trim() });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      {" "}
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
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
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {" "}
          {/* Row: fileType + ownerType */}{" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {" "}
                Loại file <span className="text-red-500">*</span>{" "}
              </label>{" "}
              <select
                value={fileType}
                onChange={(e) =>
                  setFileType(e.target.value as (typeof FILE_TYPES)[number])
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
              >
                {" "}
                {FILE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.toUpperCase()}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Chủ sở hữu
              </label>{" "}
              <select
                value={ownerType}
                onChange={(e) =>
                  setOwnerType(e.target.value as (typeof OWNER_TYPES)[number])
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
              >
                {" "}
                {OWNER_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {" "}
              URL <span className="text-red-500">*</span>{" "}
            </label>{" "}
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="uploads/..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-mono"
            />{" "}
          </div>{" "}
        </div>{" "}
        {/* Footer */}{" "}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          {" "}
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {" "}
            Huỷ{" "}
          </button>{" "}
          <button
            disabled={!url.trim() || loading}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 "
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
            {loading ? "Đang lưu..." : "Lưu"}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
