"use client";
import React, { useState, useEffect } from "react";
import {
  useMyDeveloper,
  useMyApps,
  useUpdateDeveloper,
  DeveloperItem,
} from "@/hooks/useDevelopers";
import useAuthStore from "@/store/useAuthStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AppFormModal } from "@/components/admin/apps/AppFormModal";
import {
  createApp,
  updateApp,
  AppInput,
} from "@/app/admin/(protected)/apps/appsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function DeveloperPortalPage() {
  const { user, checkAuth } = useAuthStore();
  const { data: devProfile, isLoading: loadingProfile } = useMyDeveloper();
  const { data: myApps, isLoading: loadingApps } = useMyApps();
  const updateMutation = useUpdateDeveloper();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    website: "",
    contactEmail: "",
  });

  const queryClient = useQueryClient();
  const [formTarget, setFormTarget] = useState<{
    app?: any;
    action: "create" | "edit";
  } | null>(null);

  const mCreate = useMutation({
    mutationFn: (data: AppInput) =>
      createApp(data, localStorage.getItem("token")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developers", "my-apps"] });
      setFormTarget(null);
      alert("Tạo ứng dụng thành công!");
    },
    onError: (err: any) => {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Có lỗi xảy ra",
      );
    },
  });

  const mUpdate = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AppInput }) =>
      updateApp(id, data, localStorage.getItem("token")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developers", "my-apps"] });
      setFormTarget(null);
      alert("Cập nhật ứng dụng thành công!");
    },
    onError: (err: any) => {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Có lỗi xảy ra",
      );
    },
  });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (devProfile) {
      setEditData({
        name: devProfile.name || "",
        bio: devProfile.bio || "",
        website: devProfile.website || "",
        contactEmail: devProfile.contactEmail || "",
      });
    }
  }, [devProfile]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id: devProfile!._id, data: editData });
      setIsEditing(false);
    } catch {
      /* handled */
    }
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const statusLabel = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Bị từ chối",
  };

  return (
    <>
      <Navbar />
      <main className="mt-20 max-w-5xl mx-auto px-6 lg:px-8 pb-24 space-y-8">
        {/* ===== Header ===== */}
        <div className="pt-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Developer Portal
          </h1>
          <p className="text-slate-500 mt-1">
            Quản lý hồ sơ và ứng dụng của bạn
          </p>
        </div>

        {/* ===== Profile Card ===== */}
        {loadingProfile ? (
          <ProfileSkeleton />
        ) : devProfile ? (
          <ProfileCard
            dev={devProfile}
            isEditing={isEditing}
            editData={editData}
            onEditChange={setEditData}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            onEdit={() => setIsEditing(true)}
            saving={updateMutation.isPending}
            statusColor={statusColor}
            statusLabel={statusLabel}
          />
        ) : (
          <NoProfileBanner userId={user?._id} />
        )}

        {/* ===== Stats ===== */}
        {devProfile && devProfile.status === "approved" && (
          <StatsGrid dev={devProfile} />
        )}

        {/* ===== My Apps ===== */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Ứng dụng của tôi
            </h2>
            {devProfile && devProfile.status === "approved" && (
              <button
                onClick={() => setFormTarget({ action: "create" })}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">add</span>{" "}
                Thêm mới
              </button>
            )}
          </div>
          {loadingApps ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-slate-100 animate-pulse"
                >
                  <div className="aspect-square bg-slate-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : myApps && myApps.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {myApps.map((app: any) => (
                <AppCard
                  key={app._id}
                  app={app}
                  onEdit={() => setFormTarget({ app, action: "edit" })}
                />
              ))}
            </div>
          ) : (
            <EmptyApps />
          )}
        </section>
      </main>
      <Footer />
      {formTarget && (
        <AppFormModal
          app={formTarget.app}
          action={formTarget.action}
          onClose={() => setFormTarget(null)}
          onSubmit={(data) => {
            if (formTarget.action === "create") mCreate.mutate(data);
            else if (formTarget.action === "edit" && formTarget.app)
              mUpdate.mutate({ id: formTarget.app._id, data: data });
          }}
          loading={mCreate.isPending || mUpdate.isPending}
        />
      )}
    </>
  );
}

// ===== Components =====

function ProfileCard({
  dev,
  isEditing,
  editData,
  onEditChange,
  onSave,
  onCancel,
  onEdit,
  saving,
  statusColor,
  statusLabel,
}: {
  dev: DeveloperItem;
  isEditing: boolean;
  editData: {
    name: string;
    bio: string;
    website: string;
    contactEmail: string;
  };
  onEditChange: (d: typeof editData) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  saving: boolean;
  statusColor: Record<string, string>;
  statusLabel: Record<string, string>;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-24" />
      <div className="px-6 pb-6 -mt-12">
        <div className="flex items-end gap-4 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-white border-2 border-white shadow-md overflow-hidden">
            <img
              src={dev.avatarUrl || "https://i.sstatic.net/l60Hf.png"}
              alt={dev.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 mb-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-800">{dev.name}</h2>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[dev.status]}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {statusLabel[dev.status]}
              </span>
            </div>
            <p className="text-slate-500 text-sm">{dev.userId?.email}</p>
          </div>
          {!isEditing && dev.status !== "rejected" && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <span className="material-symbols-outlined text-base">edit</span>{" "}
              Sửa
            </button>
          )}
        </div>

        {dev.status === "rejected" && dev.rejectionReason && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100">
            <p className="text-sm font-semibold text-red-700">Lý do từ chối:</p>
            <p className="text-sm text-red-600 mt-0.5">{dev.rejectionReason}</p>
          </div>
        )}

        {dev.status === "approved" && (
          <PermissionsBadge permissions={dev.permissions} />
        )}

        {isEditing ? (
          <EditForm
            editData={editData}
            onChange={onEditChange}
            onSave={onSave}
            onCancel={onCancel}
            saving={saving}
          />
        ) : (
          <ProfileInfo dev={dev} />
        )}
      </div>
    </div>
  );
}

function PermissionsBadge({
  permissions,
}: {
  permissions: DeveloperItem["permissions"];
}) {
  const allPerms = [
    { key: "canPublishApp", label: "Xuất bản app" },
    { key: "canEditOwnApps", label: "Sửa app của mình" },
    { key: "canDeleteOwnApps", label: "Xoá app của mình" },
    { key: "canViewAnalytics", label: "Xem thống kê" },
    { key: "canManagePricing", label: "Quản lý giá" },
    { key: "canRespondReviews", label: "Phản hồi đánh giá" },
  ];

  return (
    <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100">
      <p className="text-xs font-bold text-green-700 mb-2">
        QUYỀN HẠN ĐƯỢC CẤP
      </p>
      <div className="flex flex-wrap gap-2">
        {allPerms.map((p) => (
          <span
            key={p.key}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${(permissions as any)[p.key] ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"}`}
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function EditForm({
  editData,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  editData: {
    name: string;
    bio: string;
    website: string;
    contactEmail: string;
  };
  onChange: (d: typeof editData) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-3">
      {[
        { key: "name", label: "Tên Developer", type: "text" },
        { key: "website", label: "Website", type: "url" },
        { key: "contactEmail", label: "Email liên hệ", type: "email" },
      ].map((f) => (
        <div key={f.key}>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">
            {f.label}
          </label>
          <input
            type={f.type}
            value={(editData as any)[f.key]}
            onChange={(e) => onChange({ ...editData, [f.key]: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      ))}
      <div>
        <label className="text-xs font-semibold text-slate-600 mb-1 block">
          Bio
        </label>
        <textarea
          rows={3}
          value={editData.bio}
          onChange={(e) => onChange({ ...editData, bio: e.target.value })}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Huỷ
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {saving && (
            <span className="material-symbols-outlined text-sm animate-spin">
              progress_activity
            </span>
          )}
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

function ProfileInfo({ dev }: { dev: DeveloperItem }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InfoField
        icon="description"
        label="Bio"
        value={dev.bio || "Chưa cập nhật"}
      />
      <InfoField
        icon="language"
        label="Website"
        value={dev.website || "—"}
        link={dev.website}
      />
      <InfoField
        icon="email"
        label="Email liên hệ"
        value={dev.contactEmail || "—"}
      />
    </div>
  );
}

function InfoField({
  icon,
  label,
  value,
  link,
}: {
  icon: string;
  label: string;
  value: string;
  link?: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-slate-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-sm text-slate-400">
          {icon}
        </span>
        <span className="text-xs font-semibold text-slate-500">{label}</span>
      </div>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline font-medium truncate block"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm text-slate-700 font-medium truncate">{value}</p>
      )}
    </div>
  );
}

function StatsGrid({ dev }: { dev: DeveloperItem }) {
  const stats = [
    { icon: "apps", label: "Tổng ứng dụng", value: dev.stats?.totalApps || 0 },
    {
      icon: "check_circle",
      label: "Đã xuất bản",
      value: dev.stats?.publishedApps || 0,
    },
    {
      icon: "download",
      label: "Lượt tải",
      value: (dev.stats?.totalDownloads || 0).toLocaleString(),
    },
    {
      icon: "star",
      label: "Điểm đánh giá",
      value: dev.stats?.avgRating ? dev.stats.avgRating.toFixed(1) : "—",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center"
        >
          <span className="material-symbols-outlined text-2xl text-blue-500 mb-2 block">
            {s.icon}
          </span>
          <p className="text-2xl font-bold text-slate-800">{s.value}</p>
          <p className="text-xs text-slate-500 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function AppCard({ app, onEdit }: { app: any; onEdit?: () => void }) {
  const statusBadge: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    published: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow group">
      <div className="aspect-square bg-slate-100 overflow-hidden relative">
        <img
          src={app.iconUrl || "https://i.sstatic.net/l60Hf.png"}
          alt={app.name}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusBadge[app.status] || "bg-slate-100 text-slate-600"}`}
        >
          {app.status}
        </span>
      </div>
      <div className="p-3">
        <p className="font-semibold text-slate-800 text-sm truncate">
          {app.name}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {app.price === 0 ? "Miễn phí" : `$${app.price}`}
          {app.ratingScore > 0 && ` · ★ ${app.ratingScore.toFixed(1)}`}
        </p>
        <a
          href={`/app/${app.slug}`}
          className="mt-2 flex items-center gap-1 text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Xem chi tiết
          <span className="material-symbols-outlined text-xs">
            arrow_forward
          </span>
        </a>
        {onEdit && (
          <button
            onClick={onEdit}
            className="mt-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition"
          >
            Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyApps() {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
      <span className="material-symbols-outlined text-5xl text-slate-200 mb-3 block">
        apps
      </span>
      <h3 className="text-lg font-bold text-slate-500">Chưa có ứng dụng nào</h3>
      <p className="text-slate-400 text-sm mt-1">
        Hãy tạo ứng dụng đầu tiên của bạn
      </p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="bg-slate-100 h-24" />
      <div className="px-6 pb-6 -mt-12">
        <div className="w-20 h-20 rounded-2xl bg-slate-200" />
        <div className="mt-4 space-y-2">
          <div className="h-5 bg-slate-100 rounded w-1/3" />
          <div className="h-4 bg-slate-100 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

function NoProfileBanner({ userId }: { userId?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
      <span className="material-symbols-outlined text-5xl text-blue-200 mb-4 block">
        manage_accounts
      </span>
      <h2 className="text-xl font-bold text-slate-700">
        Bạn chưa có hồ sơ Developer
      </h2>
      <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
        Tạo hồ sơ developer để bắt đầu đăng tải và quản lý ứng dụng của bạn trên
        APKBugs Store.
      </p>
      <a
        href="/developer-portal/register"
        className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-base">add</span>
        Đăng ký làm Developer
      </a>
    </div>
  );
}
