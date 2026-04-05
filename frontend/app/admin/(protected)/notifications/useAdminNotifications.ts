"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";
import {
  fetchAllNotifications,
  createNotification,
  updateNotification,
  markAsRead,
  deleteNotification,
  NotificationItem,
  NotificationInput,
} from "./notificationsService";

export function useAdminNotifications() {
  const { isAdmin, isLoading: isAuthLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [isReadFilter, setIsReadFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [formTarget, setFormTarget] = useState<{
    action: "create";
    notification?: NotificationItem;
  } | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    notification: NotificationItem;
    action: "delete" | "markRead" | "markUnread";
  } | null>(null);

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["admin", "notifications", page, limit, typeFilter, isReadFilter],
    queryFn: () =>
      fetchAllNotifications(page, limit, typeFilter || undefined, isReadFilter),
  });

  const notifications = notificationsData?.docs || [];
  const totalPages = notificationsData?.totalPages || 1;
  const totalDocs = notificationsData?.totalDocs || 0;

  const mCreate = useMutation({
    mutationFn: (data: NotificationInput) => createNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
      setFormTarget(null);
      notify("Tạo thông báo thành công!", "success");
    },
    onError: () => notify("Lỗi khi tạo thông báo!", "error"),
  });

  const mUpdate = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<NotificationInput & { isRead?: boolean }>;
    }) => updateNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
      setFormTarget(null);
      notify("Cập nhật thành công!", "success");
    },
    onError: () => notify("Lỗi khi cập nhật thông báo!", "error"),
  });

  const mMarkRead = useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
      setActionTarget(null);
      notify("Đã đánh dấu là đã đọc!", "success");
    },
    onError: () => notify("Lỗi khi đánh dấu đã đọc!", "error"),
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
      setActionTarget(null);
      notify("Xoá thông báo thành công!", "success");
      if (notificationsData?.docs?.length === 1 && page > 1) setPage(page - 1);
    },
    onError: () => notify("Lỗi khi xoá thông báo!", "error"),
  });

  return {
    isAdmin,
    isAuthLoading,
    notifications,
    isLoading,
    page,
    setPage,
    totalPages,
    totalDocs,
    typeFilter,
    setTypeFilter,
    isReadFilter,
    setIsReadFilter,
    toast,
    formTarget,
    setFormTarget,
    actionTarget,
    setActionTarget,
    mCreate,
    mUpdate,
    mMarkRead,
    mDelete,
  };
}
