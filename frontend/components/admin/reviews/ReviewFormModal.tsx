"use client";
import { useEffect, useState, useRef } from "react";
import { Select } from "antd";
import "antd/dist/reset.css";
import {
  ReviewInput,
  ReviewItem,
} from "@/app/admin/(protected)/reviews/reviewsService";
import { useAdminApps } from "@/hooks/useAdminApps";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { API_URL } from "@/configs/api";

const getImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

interface Props {
  review?: ReviewItem;
  action?: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: ReviewInput) => void;
  loading: boolean;
}
const STATUS_OPTIONS = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];
function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  if (avatarUrl)
    return (
      <img
        src={getImageUrl(avatarUrl)}
        alt={name}
        className="w-6 h-6 rounded-full object-cover shrink-0"
      />
    );
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
      {initials}
    </div>
  );
}
function AppIcon({ iconUrl, name }: { iconUrl?: string; name: string }) {
  if (iconUrl)
    return (
      <img
        src={getImageUrl(iconUrl)}
        alt={name}
        className="w-6 h-6 rounded-lg object-cover bg-slate-100 shrink-0"
      />
    );
  return (
    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3.5 h-3.5 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    </div>
  );
}
export function ReviewFormModal({
  onClose,
  onSubmit,
  loading,
  action = "create",
  review,
}: Props) {
  const { data: apps = [], isLoading: isLoadingApps } = useAdminApps();
  const { data: users = [], isLoading: isLoadingUsers } = useAdminUsers();
  const [formData, setFormData] = useState<ReviewInput>(
    review
      ? {
        appId: review.appId?._id || "",
        userId: review.userId?._id || "",
        rating: review.rating || 5,
        comment: review.comment || "",
        status: review.status || "pending",
      }
      : {
        appId: "",
        userId: "",
        rating: 5,
        comment: "",
        status: "pending",
      },
  );
  const [userOptions, setUserOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Seed options so Select isn't empty before searching
    if (users.length === 0) return;

    const seed = users.slice(0, 50).map((u) => ({
      value: u._id,
      label: `${u.email}${u.fullName ? ` (${u.fullName})` : ""}`,
    }));

    setUserOptions((prev) => {
      if (prev.length > 0) return prev;
      return seed;
    });
  }, [users]);
  const handleUserSearch = (val: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const q = val.trim().toLowerCase();
      const filtered = users
        .filter((u) => {
          const email = (u.email || "").toLowerCase();
          const name = (u.fullName || u.username || "").toLowerCase();
          return email.includes(q) || name.includes(q);
        })
        .slice(0, 50)
        .map((u) => ({
          value: u._id,
          label: `${u.email}${u.fullName ? ` (${u.fullName})` : ""}`,
        }));
      setUserOptions(filtered);
    }, 300);
  };
  const selectedApp = apps.find((a) => a._id === formData.appId);
  const selectedUser = users.find((u) => u._id === formData.userId);

  useEffect(() => {
    // Ensure current selected user is always renderable in Select (edit or prefilled)
    if (!formData.userId) return;
    const has = userOptions.some((o) => o.value === formData.userId);
    if (has) return;

    const u = users.find((x) => x._id === formData.userId);
    const label = u
      ? `${u.email}${u.fullName ? ` (${u.fullName})` : ""}`
      : `Unknown user (${formData.userId})`;

    setUserOptions((prev) => [{ value: formData.userId, label }, ...prev]);
  }, [formData.userId, userOptions, users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {action === "edit" ? "Sửa Đánh giá" : "Thêm Đánh giá mới"}
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
        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          <form id="review-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              {/* App selector (Grid Style) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Ứng dụng
                </label>
                {isLoadingApps ? (
                  <div className="text-sm text-slate-400 py-2">
                    Đang tải danh sách ứng dụng...
                  </div>
                ) : apps.length === 0 ? (
                  <div className="text-sm text-slate-400 py-2">
                    Không có ứng dụng nào.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {apps.map((app) => {
                      const isSelected = formData.appId === app._id;
                      return (
                        <button
                          key={app._id}
                          type="button"
                          onClick={() => {
                            if (!isLoadingApps && action !== "edit") {
                              setFormData({ ...formData, appId: app._id });
                            }
                          }}
                          disabled={isLoadingApps || action === "edit"}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all text-sm disabled:opacity-50 ${isSelected
                            ? "border-blue-400 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                        >
                          <AppIcon iconUrl={app.iconUrl} name={app.name} />
                          <span className="font-medium text-slate-700 truncate flex-1">
                            {app.name}
                          </span>
                          {isSelected && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 text-blue-600 shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2.5}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* User selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Người dùng
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                    <UserAvatar
                      name={
                        selectedUser?.fullName || selectedUser?.username || ""
                      }
                      avatarUrl={
                        selectedUser?.avatarUrl || (selectedUser as any)?.avatar
                      }
                    />
                  </div>
                  <Select
                    showSearch
                    placeholder={isLoadingUsers ? "Đang tải..." : "Chọn người dùng"}
                    value={formData.userId || undefined}
                    loading={isLoadingUsers}
                    disabled={action === "edit"}
                    style={{ width: "100%" }}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    notFoundContent={
                      <span className="text-xs text-slate-400 px-2">
                        Không tìm thấy người dùng
                      </span>
                    }
                    options={userOptions}
                    onSearch={handleUserSearch}
                    onChange={(val) =>
                      setFormData({ ...formData, userId: String(val || "") })
                    }
                    className="pl-8"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19 9-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {action === "edit" && (
              <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded-lg border border-amber-100 md:col-span-2">
                Lưu ý: Không thể thay đổi người dùng và ứng dụng khi sửa đánh
                giá. Khi lưu đánh giá này, trạng thái sẽ tự động được đưa về
                "Chờ duyệt".
              </p>
            )}
            {/* Star rating */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                So sao
              </label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                    className={`transition-transform p-0.5 rounded-lg hover:scale-110 ${i < formData.rating ? "text-amber-400" : "text-slate-200"}`}
                  >
                    <svg
                      className="w-8 h-8"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006Z" />
                    </svg>
                  </button>
                ))}
                <span className="ml-2 text-sm font-semibold text-slate-500">
                  {formData.rating}/5
                </span>
              </div>
            </div>
            {/* Comment */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Binh luan
              </label>
              <textarea
                rows={3}
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
                placeholder="Nhan xet nguoi dung (tuy chon)..."
              />
            </div>
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Trang thai
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as ReviewInput["status"],
                    })
                  }
                  disabled={action === "edit"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white appearance-none disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19 9-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Huy bo
          </button>
          <button
            type="submit"
            form="review-form"
            disabled={loading || !formData.appId || !formData.userId}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 "
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
            {action === "edit" ? "Cập nhật đánh giá" : "Lưu đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
}
