"use client";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { NotificationTable } from "@/components/admin/notifications/NotificationTable";
import { NotificationFormModal } from "@/components/admin/notifications/NotificationFormModal";
import { useAdminNotifications } from "./useAdminNotifications";
import { NotificationInput, NotificationItem } from "./notificationsService";
const TYPE_OPTIONS = [
  { value: "", label: "Tất cả loại" },
  { value: "app_approved", label: "App được duyệt" },
  { value: "app_rejected", label: "App bị từ chối" },
  { value: "new_review", label: "Đánh giá mới" },
  { value: "new_download", label: "Tải mới" },
  { value: "system", label: "Hệ thống" },
  { value: "promotion", label: "Khuyến mãi" },
  { value: "update", label: "Cập nhật" },
];
function ToastAlert({
  toast,
}: {
  toast: { message: string; type: string } | null;
}) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      {" "}
      <span className="material-symbols-outlined">
        {toast.type === "success" ? "check_circle" : "error"}
      </span>{" "}
      {toast.message}{" "}
    </div>
  );
}
export default function AdminNotificationsPage() {
  const { checkAuth } = useAuthStore();
  const s = useAdminNotifications();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (!s.isAuthLoading && !s.isAdmin()) {
    notFound();
  }
  if (s.isAuthLoading) return null;
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {" "}
      <PageHeader
        totalDocs={s.totalDocs}
        typeFilter={s.typeFilter}
        setTypeFilter={(v) => {
          s.setTypeFilter(v);
          s.setPage(1);
        }}
        isReadFilter={s.isReadFilter}
        setIsReadFilter={(v) => {
          s.setIsReadFilter(v);
          s.setPage(1);
        }}
        onAddClick={() => s.setFormTarget({ action: "create" })}
      />{" "}
      <NotificationTable
        notifications={s.notifications}
        isLoading={s.isLoading}
        onAction={(n, action) => {
          if (action === "edit")
            s.setFormTarget({ action: "create", notification: n });
          else s.setActionTarget({ notification: n, action });
        }}
        page={s.page}
        totalPages={s.totalPages}
        onPageChange={s.setPage}
      />{" "}
      <ToastAlert toast={s.toast} />{" "}
      {s.formTarget && (
        <NotificationFormModal
          onClose={() => s.setFormTarget(null)}
          onSubmit={(data) => {
            if (s.formTarget?.notification) {
              s.mUpdate.mutate({ id: s.formTarget.notification._id, data });
            } else {
              s.mCreate.mutate(data);
            }
          }}
          loading={s.mCreate.isPending || s.mUpdate.isPending}
        />
      )}{" "}
      {s.actionTarget && (
        <ConfirmNotificationModal
          notification={s.actionTarget.notification}
          action={s.actionTarget.action}
          onClose={() => s.setActionTarget(null)}
          onConfirm={() => {
            const n = s.actionTarget!.notification;
            if (s.actionTarget!.action === "delete") s.mDelete.mutate(n._id);
            if (s.actionTarget!.action === "markRead")
              s.mMarkRead.mutate(n._id);
            if (s.actionTarget!.action === "markUnread")
              s.mUpdate.mutate({ id: n._id, data: { isRead: false } });
          }}
          loading={s.mDelete.isPending || s.mMarkRead.isPending}
        />
      )}{" "}
    </div>
  );
}
function PageHeader({
  totalDocs,
  typeFilter,
  setTypeFilter,
  isReadFilter,
  setIsReadFilter,
  onAddClick,
}: {
  totalDocs: number;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  isReadFilter: boolean | undefined;
  setIsReadFilter: (v: boolean | undefined) => void;
  onAddClick: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Quản lý Thông báo
        </h1>{" "}
        <p className="text-slate-500 text-sm mt-1">
          Hiển thị {totalDocs} thông báo
        </p>{" "}
      </div>{" "}
      <div className="flex flex-wrap items-center gap-2">
        {" "}
        {/* Type filter */}{" "}
        <div className="relative">
          {" "}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {" "}
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}{" "}
          </select>{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
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
        {/* Read filter */}{" "}
        <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-slate-200">
          {" "}
          <button
            onClick={() => setIsReadFilter(undefined)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isReadFilter === undefined ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            {" "}
            Tất cả{" "}
          </button>{" "}
          <button
            onClick={() => setIsReadFilter(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isReadFilter === false ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            {" "}
            Chưa đọc{" "}
          </button>{" "}
          <button
            onClick={() => setIsReadFilter(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isReadFilter === true ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            {" "}
            Đã đọc{" "}
          </button>{" "}
        </div>{" "}
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors "
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />{" "}
          </svg>{" "}
          Gửi thông báo{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}
function ConfirmNotificationModal({
  notification,
  action,
  onClose,
  onConfirm,
  loading,
}: {
  notification: NotificationItem;
  action: string;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  let title = "";
  let message = "";
  let btnClass = "";
  let btnText = "";
  if (action === "delete") {
    title = "Xác nhận xoá";
    message = `Bạn có chắc chắn muốn xoá thông báo này không?`;
    btnClass = "bg-red-600 hover:bg-red-700 text-white";
    btnText = "Xoá";
  } else if (action === "markRead") {
    title = "Đánh dấu đã đọc";
    message = `Đánh dấu thông báo này là đã đọc?`;
    btnClass = "bg-blue-600 hover:bg-blue-700 text-white";
    btnText = "Xác nhận";
  } else if (action === "markUnread") {
    title = "Đánh dấu chưa đọc";
    message = `Đánh dấu thông báo này là chưa đọc?`;
    btnClass = "bg-amber-600 hover:bg-amber-700 text-white";
    btnText = "Xác nhận";
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      {" "}
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        {" "}
        <div className="p-6">
          {" "}
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {title}
          </h2>{" "}
          <p className="text-slate-500 text-sm mb-1">{message}</p>{" "}
          <p className="text-xs text-slate-400 italic line-clamp-2">
            {notification.message}
          </p>{" "}
        </div>{" "}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          {" "}
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {" "}
            Huỷ bỏ{" "}
          </button>{" "}
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 ${btnClass}`}
          >
            {" "}
            {loading && (
              <span className="material-symbols-outlined animate-spin text-sm">
                progress_activity
              </span>
            )}{" "}
            {btnText}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
