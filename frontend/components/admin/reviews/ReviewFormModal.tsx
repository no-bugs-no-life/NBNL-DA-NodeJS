"use client";
import { useState } from "react";
import { ReviewInput } from "@/app/admin/(protected)/reviews/reviewsService";
import { useAdminApps } from "@/hooks/useAdminApps";
import { useAdminUsers } from "@/hooks/useAdminUsers";
interface Props {
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
function AppIcon({ iconUrl, name }: { iconUrl?: string; name: string }) {
  if (iconUrl)
    return (
      <img
        src={iconUrl}
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
export function ReviewFormModal({ onClose, onSubmit, loading }: Props) {
  const { data: apps = [], isLoading: isLoadingApps } = useAdminApps();
  const { data: users = [], isLoading: isLoadingUsers } = useAdminUsers();
  const [formData, setFormData] = useState<ReviewInput>({
    appId: "",
    userId: "",
    rating: 5,
    comment: "",
    status: "pending",
  });
  const selectedApp = apps.find((a) => a._id === formData.appId);
  const selectedUser = users.find((u) => u._id === formData.userId);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      {" "}
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {" "}
        {/* Header */}{" "}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          {" "}
          <h2 className="text-xl font-bold text-slate-800">
            Thêm Đánh giá mới
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
          <form id="review-form" onSubmit={handleSubmit} className="space-y-5">
            {" "}
            {/* App + User on same row */}{" "}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div>
                {" "}
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Ung dung
                </label>{" "}
                <div className="relative">
                  {" "}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                    {" "}
                    <AppIcon
                      iconUrl={selectedApp?.iconUrl}
                      name={selectedApp?.name || ""}
                    />{" "}
                  </div>{" "}
                  <select
                    required
                    value={formData.appId}
                    onChange={(e) =>
                      setFormData({ ...formData, appId: e.target.value })
                    }
                    disabled={isLoadingApps}
                    className="w-full pl-11 pr-8 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white appearance-none"
                  >
                    {" "}
                    <option value="">
                      {isLoadingApps ? "Dang tai..." : "-- Chon ung dung --"}
                    </option>{" "}
                    {apps.map((app) => (
                      <option key={app._id} value={app._id}>
                        {app.name}
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
              <div>
                {" "}
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nguoi dung
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
                      {isLoadingUsers ? "Dang tai..." : "-- Chon nguoi dung --"}
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
            </div>{" "}
            {/* Star rating */}{" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                So sao
              </label>{" "}
              <div className="flex items-center gap-1">
                {" "}
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                    className={`transition-transform p-0.5 rounded-lg hover:scale-110 ${i < formData.rating ? "text-amber-400" : "text-slate-200"}`}
                  >
                    {" "}
                    <svg
                      className="w-8 h-8"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      {" "}
                      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006Z" />{" "}
                    </svg>{" "}
                  </button>
                ))}{" "}
                <span className="ml-2 text-sm font-semibold text-slate-500">
                  {formData.rating}/5
                </span>{" "}
              </div>{" "}
            </div>{" "}
            {/* Comment */}{" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Binh luan
              </label>{" "}
              <textarea
                rows={3}
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
                placeholder="Nhan xet nguoi dung (tuy chon)..."
              />{" "}
            </div>{" "}
            {/* Status */}{" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Trang thai
              </label>{" "}
              <div className="relative">
                {" "}
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as ReviewInput["status"],
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white appearance-none"
                >
                  {" "}
                  {STATUS_OPTIONS.map((opt) => (
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
            Huy bo{" "}
          </button>{" "}
          <button
            type="submit"
            form="review-form"
            disabled={loading || !formData.appId || !formData.userId}
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
            Luu danh gia{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
