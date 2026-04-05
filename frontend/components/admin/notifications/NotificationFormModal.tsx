"use client";
import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import {
  NotificationInput,
  NotificationType,
} from "@/app/admin/(protected)/notifications/notificationsService";
interface Props {
  onClose: () => void;
  onSubmit: (data: NotificationInput) => void;
  loading: boolean;
}
const TYPE_OPTIONS: { value: NotificationType; label: string }[] = [
  { value: "app_approved", label: "App được duyệt" },
  { value: "app_rejected", label: "App bị từ chối" },
  { value: "new_review", label: "Đánh giá mới" },
  { value: "new_download", label: "Tải mới" },
  { value: "system", label: "Hệ thống" },
  { value: "promotion", label: "Khuyến mãi" },
  { value: "update", label: "Cập nhật" },
  { value: "sendmail", label: "Gửi mail" },
];
const CHANNEL_OPTIONS: {
  value: "inapp" | "email" | "firebase";
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    value: "inapp",
    label: "In-app",
    desc: "Thong bao trong ung dung",
    icon: "notifications",
  },
  {
    value: "email",
    label: "Email",
    desc: "Gui email qua Resend",
    icon: "mail",
  },
  {
    value: "firebase",
    label: "Firebase",
    desc: "Push notification (sap ra mat)",
    icon: "campaign",
  },
];
function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  if (avatarUrl)
    return (
      <img
        src={avatarUrl}
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
export function NotificationFormModal({ onClose, onSubmit, loading }: Props) {
  const { data: users = [], isLoading: isLoadingUsers } = useAdminUsers();
  const [formData, setFormData] = useState<NotificationInput>({
    userId: "",
    type: "system",
    message: "",
    channel: "inapp",
  });
  const selectedUser = users.find((u) => u._id === formData.userId);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      {" "}
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {" "}
        {/* Header */}{" "}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          {" "}
          <h2 className="text-xl font-bold text-slate-800">
            Gửi Thông báo
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
        <div className="px-6 py-5">
          {" "}
          <form
            id="notification-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {" "}
            {/* User selector */}{" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Người nhận
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
            {/* Type selector */}{" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Loại thông báo
              </label>{" "}
              <div className="relative">
                {" "}
                <select
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as NotificationType,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white appearance-none"
                >
                  {" "}
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
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
            {/* Channel selector */}{" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Kênh gửi
              </label>{" "}
              <div className="grid grid-cols-3 gap-2">
                {" "}
                {CHANNEL_OPTIONS.map((opt) => {
                  const selected = formData.channel === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, channel: opt.value })
                      }
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${selected ? "border-blue-400 bg-blue-50 ring-2 ring-blue-500/20" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}
                    >
                      {" "}
                      <span
                        className={`material-symbols-outlined text-lg ${selected ? "text-blue-600" : "text-slate-400"}`}
                      >
                        {" "}
                        {opt.icon}{" "}
                      </span>{" "}
                      <span
                        className={`text-xs font-semibold ${selected ? "text-blue-600" : "text-slate-600"}`}
                      >
                        {" "}
                        {opt.label}{" "}
                      </span>{" "}
                      {opt.value === "firebase" && (
                        <span className="text-[9px] text-slate-400">Soon</span>
                      )}{" "}
                    </button>
                  );
                })}{" "}
              </div>{" "}
            </div>{" "}
            {/* Message */}{" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nội dung
              </label>{" "}
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
                placeholder="Nhập nội dung thông báo..."
              />{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
        {/* Footer */}{" "}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
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
            form="notification-form"
            disabled={loading || !formData.userId || !formData.message.trim()}
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
            Gửi thông báo{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
