import api from "@/lib/axios";

export type NotificationType =
  | "app_approved"
  | "app_rejected"
  | "new_review"
  | "new_download"
  | "system"
  | "promotion"
  | "update"
  | "sendmail";

export interface NotificationItem {
  _id: string;
  userId: { _id: string; fullName: string; email: string; avatarUrl?: string };
  type: NotificationType;
  channel: "inapp" | "email" | "firebase";
  message: string;
  isRead: boolean;
  sentAt?: string | null;
  createdAt: string;
}

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

export interface NotificationInput {
  userId: string;
  type: NotificationType;
  message: string;
  channel?: "inapp" | "email" | "firebase";
}

export const fetchAllNotifications = async (
  page = 1,
  limit = 20,
  type?: string,
  isRead?: boolean,
): Promise<PaginatedResult<NotificationItem>> => {
  const params: Record<string, string | number | boolean> = { page, limit };
  if (type) params.type = type;
  if (isRead !== undefined) params.isRead = isRead;
  const res = await api.get(`/api/v1/notifications/all`, { params });
  return res.data;
};

export const createNotification = async (data: NotificationInput) => {
  const res = await api.post(`/api/v1/notifications`, data);
  return res.data;
};

export const updateNotification = async (
  id: string,
  data: Partial<NotificationInput & { isRead?: boolean }>,
) => {
  const res = await api.patch(`/api/v1/notifications/${id}`, data);
  return res.data;
};

export const markAsRead = async (id: string) => {
  const res = await api.put(`/api/v1/notifications/${id}/read`, {});
  return res.data;
};

export const deleteNotification = async (id: string) => {
  const res = await api.delete(`/api/v1/notifications/${id}/admin`);
  return res.data;
};
