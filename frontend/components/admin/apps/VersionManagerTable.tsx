"use client";

import { useMemo, useState } from "react";
import type {
  AppVersion,
  CreateAppVersionInput,
  VersionPlatform,
} from "@/app/admin/(protected)/apps/versionsService";
import { uploadFileByChunks } from "@/lib/chunkUpload";

function formatBytes(bytes?: number) {
  const b = Number(bytes || 0);
  if (!Number.isFinite(b) || b <= 0) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = b;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  const digits = value >= 10 || i === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[i]}`;
}

function platformLabel(p: VersionPlatform) {
  const map: Record<VersionPlatform, string> = {
    android: "Android",
    ios: "iOS",
    windows: "Windows",
    macos: "macOS",
    linux: "Linux",
    web: "Web",
  };
  return map[p] ?? p;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          // ignore
        }
      }}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
      title="Copy"
    >
      <span className="material-symbols-outlined text-[16px]">
        {copied ? "check" : "content_copy"}
      </span>
      {copied ? "Đã copy" : "Copy"}
    </button>
  );
}

function getFileTypeFromFilename(name: string): "apk" | "ipa" | "other" {
  const lower = (name || "").toLowerCase();
  if (lower.endsWith(".apk")) return "apk";
  if (lower.endsWith(".ipa")) return "ipa";
  return "other";
}

function toRelativeUploadsPath(urlOrPath: string): string {
  const value = String(urlOrPath || "");
  if (!value) return "";

  // If backend returns absolute URL, convert to relative path.
  try {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      const u = new URL(value);
      return u.pathname;
    }
  } catch {
    // ignore
  }

  return value;
}

function CreateVersionModal({
  open,
  onClose,
  onSubmit,
  loading,
  appId,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAppVersionInput) => void;
  loading: boolean;
  appId: string;
}) {
  const [form, setForm] = useState({
    versionNumber: "",
    versionCode: "",
    releaseName: "",
    changelog: "",
    platform: "android" as VersionPlatform,
    file: null as File | null,
    fileName: "",
    fileKey: "",
    fileSize: 0,
    mimeType: "application/octet-stream",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Tạo version mới</h2>
          <p className="text-sm text-slate-500 mt-1">
            Nhập thông tin version và file download.
          </p>
        </div>

        <form
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              app: appId,
              versionNumber: form.versionNumber.trim(),
              versionCode: Number(form.versionCode),
              releaseName: form.releaseName.trim() || undefined,
              changelog: form.changelog.trim() || undefined,
              status: "draft",
              files: [
                {
                  platform: form.platform,
                  fileKey: form.fileKey.trim(),
                  fileName: form.fileName.trim(),
                  fileSize: Number(form.fileSize || 0),
                  mimeType: form.mimeType || "application/octet-stream",
                },
              ],
            });
          }}
        >
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
              Version number
            </label>
            <input
              required
              value={form.versionNumber}
              onChange={(e) => setForm({ ...form, versionNumber: e.target.value })}
              placeholder="vd: 1.2.0"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
              Version code
            </label>
            <input
              required
              type="number"
              min={1}
              value={form.versionCode}
              onChange={(e) => setForm({ ...form, versionCode: e.target.value })}
              placeholder="vd: 12"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
              Release name
            </label>
            <input
              value={form.releaseName}
              onChange={(e) => setForm({ ...form, releaseName: e.target.value })}
              placeholder="vd: April Release"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
              Changelog
            </label>
            <input
              value={form.changelog}
              onChange={(e) => setForm({ ...form, changelog: e.target.value })}
              placeholder="vd: Fix bugs, improve performance..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
              Platform
            </label>
            <select
              value={form.platform}
              onChange={(e) =>
                setForm({ ...form, platform: e.target.value as VersionPlatform })
              }
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="android">Android</option>
              <option value="ios">iOS</option>
              <option value="windows">Windows</option>
              <option value="macos">macOS</option>
              <option value="linux">Linux</option>
              <option value="web">Web</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
              File upload
            </label>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800">
                    {form.fileName || "Chưa chọn file"}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {form.fileName ? (
                      <>
                        Size: {formatBytes(form.fileSize)}{" "}
                        <span className="text-slate-300">•</span>{" "}
                        Key:{" "}
                        <span className="font-mono text-slate-600">
                          {form.fileKey || "—"}
                        </span>
                      </>
                    ) : (
                      "Chọn file để upload lên server (không cần nhập URL)."
                    )}
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">
                    upload
                  </span>
                  {isUploading ? "Đang upload..." : "Chọn file"}
                  <input
                    type="file"
                    className="hidden"
                    disabled={loading || isUploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0] || null;
                      if (!file) return;

                      setUploadError(null);
                      setIsUploading(true);
                      try {
                        const uploaded = await uploadFileByChunks({
                          file,
                          ownerType: "app",
                          ownerId: appId,
                          fileType: getFileTypeFromFilename(file.name),
                        });

                        const url = uploaded?.url || "";
                        const fileKey = toRelativeUploadsPath(String(url || ""));

                        if (!fileKey) {
                          throw new Error("Upload thất bại: không nhận được đường dẫn file.");
                        }

                        setForm((prev) => ({
                          ...prev,
                          file,
                          fileName: file.name,
                          fileSize: file.size,
                          mimeType: file.type || "application/octet-stream",
                          fileKey,
                        }));
                      } catch (err) {
                        const msg =
                          err instanceof Error ? err.message : "Upload thất bại.";
                        setUploadError(msg);
                        setForm((prev) => ({
                          ...prev,
                          file,
                          fileName: file.name,
                          fileSize: file.size,
                          mimeType: file.type || "application/octet-stream",
                          fileKey: "",
                        }));
                      } finally {
                        setIsUploading(false);
                        e.target.value = "";
                      }
                    }}
                  />
                </label>
              </div>

              {uploadError && (
                <div className="mt-3 text-sm text-red-600 font-semibold">
                  {uploadError}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={loading || isUploading || !form.fileKey}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <span className="material-symbols-outlined animate-spin text-sm">
                  progress_activity
                </span>
              )}
              Tạo version
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function VersionManagerTable({
  appId,
  versions,
  isLoading,
  isMutating,
  onCreate,
  onPublish,
  onRevokeDownload,
}: {
  appId: string;
  versions: AppVersion[];
  isLoading: boolean;
  isMutating: boolean;
  onCreate: (payload: CreateAppVersionInput) => void;
  onPublish: (id: string) => void;
  onRevokeDownload: (id: string) => void;
}) {
  const [openCreate, setOpenCreate] = useState(false);

  const rows = useMemo(() => {
    return (versions || []).map((v) => {
      const f = v.files?.[0];
      return {
        ...v,
        file: f,
      };
    });
  }, [versions]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-slate-700">Danh sách versions</p>
          <p className="text-xs text-slate-400">
            Quản lý theo dạng bảng, tạo mới qua modal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpenCreate(true)}
          disabled={isMutating}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tạo version
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50 text-xs font-bold text-slate-600">
          <span className="col-span-2">Version</span>
          <span className="col-span-2">Platform</span>
          <span className="col-span-2">File</span>
          <span className="col-span-2">File key</span>
          <span className="col-span-1">Size</span>
          <span className="col-span-1">DL</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-1 text-right">Actions</span>
        </div>

        {isLoading ? (
          <div className="px-4 py-6 text-sm text-slate-500">Đang tải versions...</div>
        ) : rows.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-500">Chưa có version nào.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rows.map((v) => (
              <div
                key={v._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-4 text-sm items-start md:items-center"
              >
                <div className="md:col-span-2">
                  <div className="font-semibold text-slate-800">
                    {v.versionNumber}
                  </div>
                  <div className="text-xs text-slate-400">Code: {v.versionCode}</div>
                </div>

                <div className="md:col-span-2 text-slate-700">
                  {v.file?.platform ? platformLabel(v.file.platform) : "—"}
                </div>

                <div className="md:col-span-2 text-slate-700 break-all">
                  {v.file?.fileName || "—"}
                </div>

                <div className="md:col-span-2 text-slate-700 break-all flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                    {v.file?.fileKey || "—"}
                  </span>
                  {v.file?.fileKey && <CopyButton text={v.file.fileKey} />}
                </div>

                <div className="md:col-span-1 text-slate-700">
                  {formatBytes(v.file?.fileSize)}
                </div>

                <div className="md:col-span-1 text-slate-700">{v.downloadCount || 0}</div>

                <div className="md:col-span-1">
                  <span
                    className={`inline-flex px-2 py-1 rounded-lg text-xs font-bold ${
                      v.status === "published"
                        ? "bg-green-50 text-green-700"
                        : v.status === "draft"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {v.status}
                  </span>
                </div>

                <div className="md:col-span-1 flex justify-end gap-2">
                  {v.status !== "published" ? (
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={() => onPublish(v._id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                    >
                      Publish
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={() => onRevokeDownload(v._id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                    >
                      Thu hồi link
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateVersionModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        appId={appId}
        loading={isMutating}
        onSubmit={(payload) => {
          onCreate(payload);
          setOpenCreate(false);
        }}
      />
    </div>
  );
}

