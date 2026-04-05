"use client";
import { NotificationItem } from "@/app/admin/(protected)/notifications/notificationsService";
import { Pagination } from "@/components/ui/Pagination";
type NotificationAction = "delete" | "markRead" | "markUnread" | "edit";
interface Props {
  notifications: NotificationItem[];
  isLoading: boolean;
  onAction: (
    notification: NotificationItem,
    action: NotificationAction,
  ) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}
const TYPE_CONFIG: Record<
  string,
  { label: string; cls: string; icon: string }
> = {
  app_approved: {
    label: "App được duyệt",
    cls: "text-green-600 bg-green-50",
    icon: "check_circle",
  },
  app_rejected: {
    label: "App bị từ chối",
    cls: "text-red-600 bg-red-50",
    icon: "cancel",
  },
  new_review: {
    label: "Đánh giá mới",
    cls: "text-blue-600 bg-blue-50",
    icon: "star",
  },
  new_download: {
    label: "Tải mới",
    cls: "text-purple-600 bg-purple-50",
    icon: "download",
  },
  system: {
    label: "Hệ thống",
    cls: "text-slate-600 bg-slate-50",
    icon: "settings",
  },
  promotion: {
    label: "Khuyến mãi",
    cls: "text-amber-600 bg-amber-50",
    icon: "local_offer",
  },
  update: {
    label: "Cập nhật",
    cls: "text-cyan-600 bg-cyan-50",
    icon: "update",
  },
};
function TypeBadge({ type }: { type: string }) {
  const cfg = TYPE_CONFIG[type] ?? {
    label: type,
    cls: "text-slate-500 bg-slate-50",
    icon: "notifications",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md ${cfg.cls}`}
    >
      {" "}
      <span className="material-symbols-outlined text-[12px]">
        {cfg.icon}
      </span>{" "}
      {cfg.label}{" "}
    </span>
  );
}
function ReadBadge({ isRead }: { isRead: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md ${isRead ? "text-slate-400 bg-slate-100" : "text-blue-600 bg-blue-50"}`}
    >
      {" "}
      <span className="material-symbols-outlined text-[12px]">
        {isRead ? "mail" : "mark_email_unread"}
      </span>{" "}
      {isRead ? "Đã đọc" : "Chưa đọc"}{" "}
    </span>
  );
}
function UserCell({ user }: { user: NotificationItem["userId"] }) {
  return (
    <div className="flex items-center gap-3">
      {" "}
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.fullName}
          className="w-9 h-9 rounded-full object-cover bg-slate-100 shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
          {" "}
          {(user.fullName || "?")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}{" "}
        </div>
      )}{" "}
      <div className="min-w-0">
        {" "}
        <p className="font-semibold text-slate-800 text-sm truncate">
          {user.fullName}
        </p>{" "}
        <p className="text-xs text-slate-400 truncate">{user.email}</p>{" "}
      </div>{" "}
    </div>
  );
}
function ActionButton({
  action,
  onClick,
}: {
  action: NotificationAction;
  onClick: () => void;
}) {
  const configs: Record<
    NotificationAction,
    { label: string; icon: string; color: string }
  > = {
    markRead: {
      label: "Đánh dấu đã đọc",
      icon: "check",
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    markUnread: {
      label: "Đánh dấu chưa đọc",
      icon: "undo",
      color: "bg-amber-50 text-amber-600 hover:bg-amber-100",
    },
    edit: {
      label: "Sửa",
      icon: "edit",
      color: "bg-slate-50 text-slate-600 hover:bg-slate-100",
    },
    delete: {
      label: "Xoá",
      icon: "delete",
      color: "bg-red-50 text-red-600 hover:bg-red-100",
    },
  };
  const cfg = configs[action];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${cfg.color}`}
    >
      {" "}
      <span className="material-symbols-outlined text-sm">{cfg.icon}</span>{" "}
      {cfg.label}{" "}
    </button>
  );
}
export function NotificationTable({
  notifications,
  isLoading,
  onAction,
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="space-y-4">
      {" "}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
        {" "}
        <table className="w-full text-sm">
          {" "}
          <thead>
            {" "}
            <tr className="text-slate-500 bg-slate-50/50 border-b border-slate-100/50">
              {" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Người nhận
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Nội dung
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Loại
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Trạng thái
              </th>{" "}
              <th className="text-right px-6 py-4 font-semibold text-slate-600">
                Thao tác
              </th>{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody>
            {" "}
            {isLoading ? (
              <LoadingRows />
            ) : (
              <DataRows notifications={notifications} onAction={onAction} />
            )}{" "}
          </tbody>{" "}
        </table>{" "}
      </div>{" "}
      {!isLoading && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}{" "}
    </div>
  );
}
function LoadingRows() {
  return (
    <>
      {" "}
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-slate-50">
          {" "}
          <td colSpan={5} className="px-6 py-4">
            <div className="h-4 bg-slate-100 rounded w-full" />
          </td>{" "}
        </tr>
      ))}{" "}
    </>
  );
}
function DataRows({
  notifications,
  onAction,
}: {
  notifications: NotificationItem[];
  onAction: (n: NotificationItem, a: NotificationAction) => void;
}) {
  if (notifications.length === 0) {
    return (
      <tr>
        {" "}
        <td colSpan={5} className="text-center py-16 text-slate-400">
          Chưa có thông báo nào.
        </td>{" "}
      </tr>
    );
  }
  return (
    <>
      {" "}
      {notifications.map((n) => (
        <tr
          key={n._id}
          className={`hover:bg-slate-50/50 transition-colors border-b border-slate-50 ${!n.isRead ? "bg-blue-50/20" : ""}`}
        >
          {" "}
          <td className="px-6 py-4">
            <UserCell user={n.userId} />
          </td>{" "}
          <td className="px-6 py-4 max-w-xs">
            {" "}
            <p className="text-sm text-slate-700 line-clamp-2">
              {n.message}
            </p>{" "}
            <p className="text-xs text-slate-400 mt-1">
              {" "}
              {n.createdAt
                ? new Date(n.createdAt).toLocaleString("vi-VN")
                : ""}{" "}
            </p>{" "}
          </td>{" "}
          <td className="px-6 py-4">
            <TypeBadge type={n.type} />
          </td>{" "}
          <td className="px-6 py-4">
            <ReadBadge isRead={n.isRead} />
          </td>{" "}
          <td className="px-6 py-4 text-right">
            {" "}
            <div className="flex items-center justify-end gap-2">
              {" "}
              {n.isRead ? (
                <ActionButton
                  action="markUnread"
                  onClick={() => onAction(n, "markUnread")}
                />
              ) : (
                <ActionButton
                  action="markRead"
                  onClick={() => onAction(n, "markRead")}
                />
              )}{" "}
              <ActionButton action="edit" onClick={() => onAction(n, "edit")} />{" "}
              <ActionButton
                action="delete"
                onClick={() => onAction(n, "delete")}
              />{" "}
            </div>{" "}
          </td>{" "}
        </tr>
      ))}{" "}
    </>
  );
}
