"use client";
import { use, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { AppInfoPage } from "../AppInfoPage";
import { useAdminAppDetail } from "../useAdminApps";
interface Props {
  params: Promise<{ id: string }>;
}
export default function AppDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  const s = useAdminAppDetail(id);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (!s.isAuthLoading && !s.isAdmin()) {
    notFound();
  }
  if (s.isAuthLoading) return null;
  if (!s.app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        {" "}
        <span className="material-symbols-outlined text-6xl text-slate-200">
          search_off
        </span>{" "}
        <p className="text-slate-500">Không tìm thấy ứng dụng.</p>{" "}
        <button
          onClick={() => router.push("/admin/apps")}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          {" "}
          Quay lại danh sách{" "}
        </button>{" "}
      </div>
    );
  }

  const app = s.app;
  const loadingAction =
    s.mApprove.isPending ||
    s.mReject.isPending ||
    s.mDelete.isPending ||
    s.mToggleDisable.isPending ||
    s.mUpdate.isPending;

  return (
    <>
      <AppInfoPage
        app={app}
        onApprove={() => s.mApprove.mutate(app._id)}
        onReject={() => s.mReject.mutate(app._id)}
        onToggleDisable={() => s.mToggleDisable.mutate(app._id)}
        onEdit={(data) => s.mUpdate.mutate({ appId: app._id, data })}
        onBack={() => router.push("/admin/apps")}
        loadingAction={loadingAction}
      />
      {s.toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold text-white ${s.toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          <span className="material-symbols-outlined">
            {s.toast.type === "success" ? "check_circle" : "error"}
          </span>
          {s.toast.message}
        </div>
      )}
    </>
  );
}
