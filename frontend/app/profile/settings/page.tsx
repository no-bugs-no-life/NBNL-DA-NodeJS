"use client";
import { useProfileSettings } from "./useProfileSettings";
import { BasicInfoForm } from "@/components/profile/settings/BasicInfoForm";
import { SocialLinksForm } from "@/components/profile/settings/SocialLinksForm";
import { ImageUploadForm } from "@/components/profile/settings/ImageUploadForm";

function SettingsHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-black text-slate-800 tracking-tight">
        Cài đặt Tài khoản
      </h1>
      <p className="text-slate-500 mt-2 font-medium">
        Cập nhật thông tin cá nhân cơ bản và hình dáng hiển thị.
      </p>
    </div>
  );
}

function ToastAlert({
  toast,
}: {
  toast: { message: string; type: string } | null;
}) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      <span className="material-symbols-outlined">
        {toast.type === "success" ? "check_circle" : "error"}
      </span>{" "}
      {toast.message}
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateMutation, toast } = useProfileSettings();

  if (!user)
    return (
      <div className="p-8 text-center text-slate-500 font-semibold animate-pulse">
        Đang tải cấu hình...
      </div>
    );

  return (
    <div className="max-w-3xl pt-2 pb-12 w-full animate-in fade-in duration-300">
      <SettingsHeader />
      <ToastAlert toast={toast} />

      <div className="space-y-6">
        <ImageUploadForm
          user={user}
          onSave={(v: any) => updateMutation.mutate(v)}
          loading={updateMutation.isPending}
        />
        <BasicInfoForm
          user={user}
          onSave={(v: any) => updateMutation.mutate(v)}
          loading={updateMutation.isPending}
        />
        <SocialLinksForm
          user={user}
          onSave={(v: any) => updateMutation.mutate(v)}
          loading={updateMutation.isPending}
        />
      </div>
    </div>
  );
}
