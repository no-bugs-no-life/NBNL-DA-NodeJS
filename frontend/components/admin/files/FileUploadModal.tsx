"use client";
import { useState, useRef, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
export type CreatePayload =
  | { type: "multipart"; formData: FormData }
  | {
    type: "manual";
    data: {
      ownerType: string;
      ownerId?: string;
      fileType: string;
      url: string;
    };
  };
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
import { FileItem } from "@/hooks/useFiles";
interface Props {
  action?: "create" | "edit";
  file?: FileItem;
  onClose: () => void;
  onSubmit: (payload: CreatePayload) => void;
  loading?: boolean;
}
export function FileUploadModal({
  onClose,
  onSubmit,
  loading,
  action = "create",
  file,
}: Props) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [fileType, setFileType] = useState<string>("icon");
  const [ownerType, setOwnerType] = useState<string>("user");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualUrl, setManualUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: users = [] } = useUsers();

  useEffect(() => {
    if (action === "edit" && file) {
      setActiveTab("url");
      setFileType(file.fileType || "other");
      setOwnerType(file.ownerType || "user");
      setSelectedUserId(file.ownerId || "");
      setManualUrl(file.url || "");
    }
  }, [action, file]);

  const handleSubmit = () => {
    if (activeTab === "url") {
      if (!manualUrl.trim()) return;
      onSubmit({
        type: "manual",
        data: {
          ownerType,
          ownerId: selectedUserId || undefined,
          fileType,
          url: manualUrl.trim(),
        },
      });
    } else {
      if (!selectedFile) return;
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("fileType", fileType);
      fd.append("ownerType", ownerType);
      if (selectedUserId) fd.append("ownerId", selectedUserId);
      onSubmit({ type: "multipart", formData: fd });
    }
  };
  const isValid = activeTab === "url" ? manualUrl.trim() : selectedFile;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {action === "edit" ? "Sửa thông tin file" : "Tải lên file mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* Tab toggle */}
        <div className="px-6 pt-5">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
            {action !== "edit" && (
              <button
                onClick={() => {
                  setActiveTab("upload");
                  setSelectedFile(null);
                  setManualUrl("");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "upload" ? "bg-white text-slate-800 " : "text-slate-500 hover:text-slate-700"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8-4-4m0 0 8 8m-8 0h8"
                  />
                </svg>
                Tải file lên
              </button>
            )}
            <button
              onClick={() => {
                setActiveTab("url");
                setSelectedFile(null);
                setManualUrl("");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "url" ? "bg-white text-slate-800 " : "text-slate-500 hover:text-slate-700"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1"
                />
              </svg>
              Nhập URL
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-5">
            {/* Row: fileType + ownerType */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Loại file <span className="text-red-500">*</span>
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
                >
                  {FILE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Chủ sở hữu
                </label>
                <select
                  value={ownerType}
                  onChange={(e) => setOwnerType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
                >
                  {OWNER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Người dùng
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
              >
                <option value="">-- Không chọn --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Upload tab */}
          {activeTab === "upload" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                File <span className="text-red-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${selectedFile ? "border-green-400 bg-green-50" : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-8 h-8 ${selectedFile ? "text-green-500" : "text-slate-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                {selectedFile ? (
                  <span className="text-sm text-green-700 font-semibold">
                    {selectedFile.name}
                  </span>
                ) : (
                  <>
                    <span className="text-sm text-slate-600 font-medium">
                      Click để chọn file
                    </span>
                    <span className="text-xs text-slate-400">
                      PNG, JPG, APK, IPA...
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
          {/* URL tab */}
          {activeTab === "url" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                URL file <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="uploads/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-mono"
              />
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
        >
          Huỷ
        </button>
        <button
          disabled={!isValid || loading}
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 "
        >
          {loading && (
            <svg
              className="w-4 h-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {loading
            ? "Đang xử lý..."
            : action === "edit"
              ? "Cập nhật"
              : "Tải lên"}
        </button>
      </div>
    </div>
    </div >
  );
}
