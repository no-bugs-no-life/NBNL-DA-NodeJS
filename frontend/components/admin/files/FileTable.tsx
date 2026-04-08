"use client";
import { useState } from "react";
import { FileItem } from "@/hooks/useFiles";
import { Pagination } from "@/components/ui/Pagination";
import { API_URL } from "@/configs/api";
interface Props {
  files: FileItem[];
  isLoading: boolean;
  onEdit: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}
const FILE_TYPE_COLORS: Record<string, string> = {
  apk: "bg-green-100 text-green-700",
  ipa: "bg-slate-100 text-slate-700",
  icon: "bg-purple-100 text-purple-700",
  banner: "bg-orange-100 text-orange-700",
  screenshot: "bg-blue-100 text-blue-700",
  avatar: "bg-pink-100 text-pink-700",
  other: "bg-slate-100 text-slate-500",
};
const OWNER_TYPE_LABELS: Record<string, string> = {
  app: "App",
  user: "User",
  developer: "Developer",
};
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
} // Preview image/video for non-image files use external link
function PreviewModal({
  file,
  onClose,
}: {
  file: FileItem;
  onClose: () => void;
}) {
  const isImage =
    file.fileType &&
    ["icon", "banner", "screenshot", "avatar"].includes(file.fileType);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        {isImage ? (
          <img
            src={`${API_URL}/${file.url}`}
            alt={file.fileType}
            className="w-full max-h-[70vh] object-contain bg-slate-100"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-8">
            <span className="material-symbols-outlined text-6xl text-slate-400">
              draft
            </span>
            <p className="text-slate-600 font-medium text-center">
              {file.fileType.toUpperCase()} file
            </p>
            <a
              href={`${API_URL}/${file.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Mở file bên ngoài
            </a>
          </div>
        )}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
          <span
            className={`inline-flex items-center px-2 py-1 rounded bg-slate-100 font-semibold uppercase ${FILE_TYPE_COLORS[file.fileType]}`}
          >
            {file.fileType}
          </span>
          <span className="text-slate-500 font-semibold">
            {formatBytes(file.size)}
          </span>
          <span className="text-slate-400 font-mono truncate max-w-[200px] sm:max-w-md">{`${API_URL}/${file.url}`}</span>
        </div>
      </div>
    </div>
  );
}
export function FileTable({
  files,
  isLoading,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: Props) {
  const [previewTarget, setPreviewTarget] = useState<FileItem | null>(null);
  return (
    <>
      <div className="bg-transparent md:bg-white md:rounded-2xl md:overflow-hidden">
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 bg-slate-50/50 border-b border-slate-100/50">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Loại file & Tên
                </th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Chủ sở hữu
                </th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Kích thước
                </th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Ngày tạo
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
                  files={files}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPreview={setPreviewTarget}
                />
              )}
            </tbody>
          </table>
        </div>
        {/* MOBILE CARDS VIEW */}
        <div className="block md:hidden space-y-4">
          {isLoading ? (
            <LoadingCards />
          ) : (
            <MobileCards
              files={files}
              onEdit={onEdit}
              onDelete={onDelete}
              onPreview={setPreviewTarget}
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
      {previewTarget && (
        <PreviewModal
          file={previewTarget}
          onClose={() => setPreviewTarget(null)}
        />
      )}
    </>
  );
}
function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-slate-50">
          <td colSpan={5} className="px-6 py-4">
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
          <div className="flex gap-4 mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
          </div>
          <div className="h-8 bg-slate-100 rounded w-full" />
        </div>
      ))}
    </>
  );
}
function ActionButtons({
  file,
  onPreview,
  onEdit,
  onDelete,
  showLabels = false,
}: {
  file: FileItem;
  onPreview: (f: FileItem) => void;
  onEdit: (f: FileItem) => void;
  onDelete: (f: FileItem) => void;
  showLabels?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${showLabels ? "justify-start mt-2 border-t border-slate-50 pt-3 flex-wrap" : "justify-end"}`}
    >
      <button
        title="Xem"
        onClick={() => onPreview(file)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">
          visibility
        </span>
        {showLabels && "Xem"}
      </button>
      <button
        title="Sửa"
        onClick={() => onEdit(file)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">edit</span>
        {showLabels && "Sửa"}
      </button>
      <button
        title="Xoá"
        onClick={() => onDelete(file)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
        {showLabels && "Xoá"}
      </button>
    </div>
  );
}
function MobileCards({
  files,
  onEdit,
  onDelete,
  onPreview,
}: {
  files: FileItem[];
  onEdit: (f: FileItem) => void;
  onDelete: (f: FileItem) => void;
  onPreview: (f: FileItem) => void;
}) {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-xl">
        Chưa có file nào.
      </div>
    );
  }
  return (
    <>
      {files.map((file) => {
        const typeColor =
          FILE_TYPE_COLORS[file.fileType] ?? FILE_TYPE_COLORS.other;
        return (
          <div
            key={file._id}
            className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${typeColor} mb-1.5`}
                >
                  {file.fileType}
                </span>
                <p className="text-xs text-slate-600 font-mono truncate">
                  {file.url.split("/").pop()}
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400 shrink-0">
                {formatBytes(file.size)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1 bg-slate-50 p-2 rounded-lg">
              <div>
                <span className="font-semibold text-slate-500 block text-[10px] uppercase mb-0.5">
                  Chủ sở hữu
                </span>
                <span className="text-slate-800 font-medium">
                  {OWNER_TYPE_LABELS[file.ownerType] ?? file.ownerType}:
                  <span className="font-mono text-[10px] text-slate-500">
                    {file.ownerId.slice(-6)}
                  </span>
                </span>
              </div>
              <div className="text-right text-slate-400">
                {new Date(file.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
            <ActionButtons
              file={file}
              onPreview={onPreview}
              onEdit={onEdit}
              onDelete={onDelete}
              showLabels={true}
            />
          </div>
        );
      })}
    </>
  );
}
function DataRows({
  files,
  onEdit,
  onDelete,
  onPreview,
}: {
  files: FileItem[];
  onEdit: (f: FileItem) => void;
  onDelete: (f: FileItem) => void;
  onPreview: (f: FileItem) => void;
}) {
  if (files.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="text-center py-16 text-slate-400">
          Chưa có file nào.
        </td>
      </tr>
    );
  }
  return (
    <>
      {files.map((file) => {
        const typeColor =
          FILE_TYPE_COLORS[file.fileType] ?? FILE_TYPE_COLORS.other;
        return (
          <tr
            key={file._id}
            className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-none"
          >
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-xl text-xs font-bold uppercase shrink-0 ${typeColor}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {["icon", "banner", "screenshot", "avatar"].includes(
                      file.fileType,
                    )
                      ? "image"
                      : "draft"}
                  </span>
                </span>
                <div className="min-w-0">
                  <span
                    className={`inline-block mb-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${typeColor}`}
                  >
                    {file.fileType}
                  </span>
                  <p className="text-xs text-slate-600 font-mono truncate max-w-[180px]">
                    {file.url.split("/").pop()}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-slate-600">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded mb-1 inline-block">
                {OWNER_TYPE_LABELS[file.ownerType] ?? file.ownerType}
              </span>
              <div className="text-[11px] text-slate-500 font-mono">
                {file.ownerId}
              </div>
            </td>
            <td className="px-6 py-4 text-slate-600 text-xs font-mono font-medium tracking-wide">
              {formatBytes(file.size)}
            </td>
            <td className="px-6 py-4 text-slate-400 text-xs">
              {new Date(file.createdAt).toLocaleDateString("vi-VN")}
            </td>
            <td className="px-6 py-4 text-right">
              <ActionButtons
                file={file}
                onPreview={onPreview}
                onEdit={onEdit}
                onDelete={onDelete}
                showLabels={false}
              />
            </td>
          </tr>
        );
      })}
    </>
  );
}
