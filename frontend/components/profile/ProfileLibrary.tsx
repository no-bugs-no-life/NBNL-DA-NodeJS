"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Play, LayoutGrid } from "lucide-react";
import { useProfileLibrary } from "@/hooks/useProfileLibrary";
import { apiClient } from "@/store/useAuthStore";

type VersionStatus = "draft" | "published" | "deprecated" | "archived";
type VersionPlatform = "android" | "ios" | "windows" | "macos" | "linux" | "web";

interface LibraryVersion {
  _id: string;
  versionNumber: string;
  versionCode: number;
  status: VersionStatus;
  files: {
    platform: VersionPlatform;
    fileName: string;
    fileSize: number;
  }[];
}

export default function ProfileLibrary() {
  const { items, isLoading } = useProfileLibrary();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [versionList, setVersionList] = useState<Record<string, LibraryVersion[]>>({});
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [modalAppId, setModalAppId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const openVersionDownload = async (versionId: string, platform: VersionPlatform) => {
    if (!versionId || downloadingId === versionId) return;
    try {
      setDownloadingId(versionId);
      setModalError(null);
      const response = await apiClient.get(
        `/api/v1/versions/${versionId}/download/${platform}`,
      );
      const data = response.data?.data || response.data;
      if (!data?.downloadUrl) {
        setModalError("Không thể tải xuống cho phiên bản này.");
        return;
      }
      const anchor = document.createElement("a");
      anchor.href = data.downloadUrl;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (error) {
      let msg = "Lỗi tải xuống hoặc bạn chưa mua.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      setModalError(msg);
    } finally {
      setDownloadingId(null);
    }
  };

  const openDownloadModal = async (appId: string) => {
    if (!appId) return;
    setModalError(null);
    if (!versionList[appId]) {
      const res = await apiClient.get(`/api/v1/versions/app/${appId}`);
      const payload = res.data?.data ?? res.data;
      const versions = Array.isArray(payload) ? (payload as LibraryVersion[]) : [];
      setVersionList((prev) => ({ ...prev, [appId]: versions }));
    }
    setModalAppId(appId);
    setIsVersionModalOpen(true);
  };

  const closeModal = () => {
    setIsVersionModalOpen(false);
    setModalAppId(null);
    setModalError(null);
  };

  useEffect(() => {
    if (!isVersionModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isVersionModalOpen]);

  const currentVersions = modalAppId ? versionList[modalAppId] || [] : [];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Thư viện của bạn ({items.length})
        </h2>
        <div className="text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors">
          Lọc gần đây
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="animate-pulse rounded-xl overflow-hidden">
              <div className="aspect-[16/9] md:aspect-[4/3] bg-slate-100" />
              <div className="p-4 space-y-2 bg-white">
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 border-dashed flex flex-col items-center gap-3">
          <LayoutGrid className="w-12 h-12 text-slate-300" />
          <p className="text-lg font-medium">Thư viện trống</p>
          <p className="text-sm">Bạn chưa tải ứng dụng hay trò chơi nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => void openDownloadModal(item.appId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  void openDownloadModal(item.appId);
                }
              }}
              className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[16/9] md:aspect-[4/3] relative overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void openDownloadModal(item.appId);
                    }}
                    className="bg-white text-slate-900 rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
                  >
                    <Play className="w-6 h-6 fill-slate-900" />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-slate-900 mb-1 truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Đã chơi: <span className="text-slate-700 font-medium">0 giờ</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Lần cuối: {new Date(item.lastPlayed).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isVersionModalOpen && modalAppId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Chọn phiên bản để tải"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-800">
                  Chọn phiên bản để tải
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Chỉ hiển thị các phiên bản có file Android.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-700"
              >
                Đóng
              </button>
            </div>

            <div className="p-5">
              {modalError && (
                <div className="mb-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {modalError}
                </div>
              )}

              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                {currentVersions
                  .filter((v) => v.status === "published")
                  .filter((v) => v.files.some((f) => f.platform === "android"))
                  .length === 0 && (
                  <p className="text-sm text-slate-500">
                    Chưa có phiên bản Android đã publish để tải.
                  </p>
                )}

                {currentVersions
                  .filter((v) => v.status === "published")
                  .filter((v) => v.files.some((f) => f.platform === "android"))
                  .map((v) => {
                    const androidFile = v.files.find((f) => f.platform === "android");
                    if (!androidFile) return null;

                    return (
                      <div
                        key={v._id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate">
                            v{v.versionNumber} ({v.status})
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {androidFile.fileName}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => void openVersionDownload(v._id, "android")}
                          disabled={downloadingId === v._id}
                          className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:brightness-110 disabled:opacity-60"
                        >
                          {downloadingId === v._id ? "Đang tải..." : "Tải"}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
