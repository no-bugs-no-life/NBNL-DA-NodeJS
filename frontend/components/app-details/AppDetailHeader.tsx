"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppDetailStore } from "../../store/useAppDetailStore";
import AppStats from "./AppStats";
import { API_URL } from "@/configs/api";
import api from "@/lib/axios";

type ModalVariant = "error" | "info";

type VersionStatus = "draft" | "published" | "deprecated" | "archived";
type VersionPlatform = "android" | "ios" | "windows" | "macos" | "linux" | "web";

interface AppVersion {
  _id: string;
  app: string;
  versionNumber: string;
  versionCode: number;
  status: VersionStatus;
  files: {
    platform: VersionPlatform;
    fileName: string;
    fileSize: number;
  }[];
}

function InfoModal({
  open,
  title,
  message,
  variant,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  variant: ModalVariant;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const iconWrapClass =
    variant === "error"
      ? "bg-red-100 text-red-600"
      : "bg-blue-100 text-blue-600";
  const iconName = variant === "error" ? "error" : "info";
  const buttonClass =
    variant === "error"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconWrapClass}`}
            >
              <span className="material-symbols-outlined text-xl">
                {iconName}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-800">{title}</h2>
              <p className="text-slate-500 text-sm mt-1 whitespace-pre-line">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${buttonClass}`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppDetailHeader() {
  const { appInfo } = useAppDetailStore();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [versionDownloadingId, setVersionDownloadingId] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    variant: ModalVariant;
  }>({ open: false, title: "", message: "", variant: "info" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasToken(Boolean(localStorage.getItem("token")));
  }, []);

  const { data: myOrders = [] } = useQuery({
    queryKey: ["orders", "my"],
    queryFn: async () => {
      const response = await api.get("/api/v1/orders/my");
      const payload = response.data?.data || response.data;
      return Array.isArray(payload) ? payload : [];
    },
    enabled: hasToken && !!appInfo,
  });

  const { data: appVersions = [] } = useQuery<AppVersion[]>({
    queryKey: ["app-versions", appInfo?._id],
    queryFn: async () => {
      if (!appInfo?._id) return [];
      const response = await api.get(`/api/v1/versions/app/${appInfo._id}`);
      const payload = response.data?.data || response.data;
      return Array.isArray(payload) ? (payload as AppVersion[]) : [];
    },
    enabled: !!appInfo?._id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/v1/carts/my/items", {
        app: appInfo?._id,
        itemType: "one_time",
        quantity: 1,
      });
    },
  });

  if (!appInfo) return null;

  const hasPurchased = hasToken && myOrders.some(
    (order: any) =>
      order?.status === "completed" &&
      Array.isArray(order?.items) &&
      order.items.some((item: any) => item?.app === appInfo._id),
  );

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const selectedPlatform = (
        appInfo.platforms?.[0] || "android"
      ).toLowerCase();
      const response = await api.get(
        `/api/v1/versions/app/${appInfo._id}/download/${selectedPlatform}`,
      );
      const data = response.data?.data || response.data;
      if (data?.downloadUrl) {
        const anchor = document.createElement("a");
        anchor.href = data.downloadUrl;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      } else {
        setModal({
          open: true,
          title: "Không thể tải xuống",
          message: "Có lỗi xảy ra khi tải xuống.",
          variant: "error",
        });
      }
    } catch (error) {
      let msg = "Lỗi tải xuống hoặc bạn chưa mua.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      setModal({
        open: true,
        title: "Tải xuống thất bại",
        message: msg,
        variant: "error",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleVersionDownload = async (versionId: string, platform: VersionPlatform) => {
    if (!versionId) return;
    try {
      setVersionDownloadingId(versionId);
      const response = await api.get(
        `/api/v1/versions/${versionId}/download/${platform}`,
      );
      const data = response.data?.data || response.data;
      if (!data?.downloadUrl) {
        setModal({
          open: true,
          title: "Không thể tải xuống",
          message: "Không tìm thấy đường dẫn tải cho phiên bản này.",
          variant: "error",
        });
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
      setModal({
        open: true,
        title: "Tải xuống thất bại",
        message: msg,
        variant: "error",
      });
    } finally {
      setVersionDownloadingId(null);
    }
  };

  const handleAddToCartAndCheckout = async () => {
    try {
      await addToCartMutation.mutateAsync();
      router.push("/checkout");
    } catch (error) {
      let msg = "Không thể thêm vào giỏ hàng.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      setModal({
        open: true,
        title: "Thao tác thất bại",
        message: msg,
        variant: "error",
      });
    }
  };

  return (
    <header className="relative py-12 flex flex-col md:flex-row items-start gap-10">
      <InfoModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        variant={modal.variant}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
      />
      <div className="w-48 h-48 rounded-[32px] bg-white shadow-xl flex-shrink-0 flex items-center justify-center p-4">
        {appInfo.iconUrl && (
          <img
            alt={appInfo.name}
            className="w-full h-full object-contain"
            src={
              appInfo.iconUrl.startsWith("http")
                ? appInfo.iconUrl
                : `${API_URL}/${appInfo.iconUrl.replace(/\\/g, "/")}`
            }
          />
        )}
      </div>
      <div className="flex-grow space-y-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-on-background mb-2">
            {appInfo.name}
          </h1>
          <p className="text-xl text-primary font-medium">
            {appInfo.developerId?.name || "Developer"}
          </p>
        </div>
        <AppStats />
        <div className="flex gap-4 items-center">
          {appInfo.price === 0 || hasPurchased ? (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="primary-cta text-on-primary px-10 py-3 rounded-lg font-semibold text-lg shadow-lg hover:brightness-110 transition-all scale-95 duration-150 ease-in-out active:scale-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDownloading ? "Đang xử lý..." : "Tải xuống"}
            </button>
          ) : (
            <button
              onClick={handleAddToCartAndCheckout}
              disabled={addToCartMutation.isPending}
              className="primary-cta text-on-primary px-10 py-3 rounded-lg font-semibold text-lg shadow-lg hover:brightness-110 transition-all scale-95 duration-150 ease-in-out active:scale-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {addToCartMutation.isPending ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>
          )}
          <button className="bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-semibold text-lg hover:bg-surface-dim transition-colors">
            Dùng thử miễn phí
          </button>
        </div>
        {appVersions.length > 0 && (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-sm font-medium text-slate-700 mb-2">
              Các phiên bản có thể tải:
            </p>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {appVersions
                .filter((v) => v.files && v.files.length > 0)
                .map((v) => {
                  const primaryFile = v.files[0];
                  return (
                    <div
                      key={v._id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">
                          v{v.versionNumber} ({v.status})
                        </span>
                        <span className="text-slate-500">
                          {primaryFile.platform} • {primaryFile.fileName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleVersionDownload(primaryFile ? v._id : "", primaryFile.platform)
                        }
                        disabled={!!versionDownloadingId}
                        className="px-3 py-1.5 rounded-md bg-primary text-white text-xs font-semibold hover:brightness-110 disabled:opacity-60"
                      >
                        {versionDownloadingId === v._id ? "Đang tải..." : "Tải phiên bản này"}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
