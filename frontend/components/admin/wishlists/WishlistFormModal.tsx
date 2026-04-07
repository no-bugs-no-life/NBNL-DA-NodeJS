"use client";
import { useState } from "react";
import { WishlistAppItem } from "@/hooks/useWishlist";
import { useAdminApps } from "@/hooks/useAdminApps";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { API_URL } from "@/configs/api";

const getImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

export interface WishlistFormInput {
  userId: string;
  appIds: string[];
}
interface Props {
  onClose: () => void;
  onSubmit: (data: WishlistFormInput) => void;
  loading: boolean;
}
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
      {" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3.5 h-3.5 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        {" "}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z"
        />{" "}
      </svg>{" "}
    </div>
  );
}
export function WishlistFormModal({ onClose, onSubmit, loading }: Props) {
  const { data: apps = [], isLoading: isLoadingApps } = useAdminApps();
  const { data: users = [], isLoading: isLoadingUsers } = useAdminUsers();
  const [formData, setFormData] = useState<WishlistFormInput>({
    userId: "",
    appIds: [],
  });
  const selectedUser = users.find((u) => u._id === formData.userId);
  const toggleApp = (appId: string) => {
    setFormData((prev) => ({
      ...prev,
      appIds: prev.appIds.includes(appId)
        ? prev.appIds.filter((id) => id !== appId)
        : [...prev.appIds, appId],
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      {" "}
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {" "}
        {/* Header */}{" "}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          {" "}
          <h2 className="text-xl font-bold text-slate-800">
            Thêm Wishlist mới
          </h2>{" "}
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
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {" "}
          <form
            id="wishlist-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {" "}
            {/* User selector */}{" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Người dùng
              </label>{" "}
              <div className="relative">
                {" "}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  {" "}
                  <UserAvatar
                    name={
                      selectedUser?.fullName || selectedUser?.username || ""
                    }
                    avatarUrl={selectedUser?.avatarUrl}
                  />{" "}
                </div>{" "}
                <select
                  required
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  disabled={isLoadingUsers}
                  className="w-full pl-11 pr-8 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white appearance-none"
                >
                  {" "}
                  <option value="">
                    {isLoadingUsers ? "Đang tải..." : "-- Chọn người dùng --"}
                  </option>{" "}
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {" "}
                      {user.fullName || user.username}
                      {user.email ? ` — ${user.email}` : ""}{" "}
                    </option>
                  ))}{" "}
                </select>{" "}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19 9-7 7-7-7"
                    />{" "}
                  </svg>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* App selector */}{" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {" "}
                Ứng dụng{" "}
                <span className="font-normal text-slate-400">
                  (chọn nhiều)
                </span>{" "}
              </label>{" "}
              {isLoadingApps ? (
                <div className="text-sm text-slate-400 py-2">
                  Đang tải danh sách ứng dụng...
                </div>
              ) : apps.length === 0 ? (
                <div className="text-sm text-slate-400 py-2">
                  Không có ứng dụng nào.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {" "}
                  {apps.map((app) => {
                    const isSelected = formData.appIds.includes(app._id);
                    return (
                      <button
                        key={app._id}
                        type="button"
                        onClick={() => toggleApp(app._id)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all text-sm ${isSelected ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}
                      >
                        {" "}
                        <AppIcon iconUrl={app.iconUrl} name={app.name} />{" "}
                        <span className="font-medium text-slate-700 truncate flex-1">
                          {app.name}
                        </span>{" "}
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-blue-600 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                          >
                            {" "}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />{" "}
                          </svg>
                        )}{" "}
                      </button>
                    );
                  })}{" "}
                </div>
              )}{" "}
              {formData.appIds.length > 0 && (
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  {" "}
                  Đã chọn {formData.appIds.length} ứng dụng{" "}
                </p>
              )}{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
        {/* Footer */}{" "}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          {" "}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {" "}
            Huỷ bỏ{" "}
          </button>{" "}
          <button
            type="submit"
            form="wishlist-form"
            disabled={
              loading || !formData.userId || formData.appIds.length === 0
            }
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 "
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
            Lưu Wishlist{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
