"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";
import {
  fetchSubscriptions,
  createSubscription,
  renewSubscription,
  cancelSubscription,
  deleteSubscription,
  SubscriptionItem,
} from "./subscriptionsService";

export function useAdminSubscriptions() {
  const { isAdmin, isLoading: isAuthLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionItem | null>(
    null,
  );
  const [renewTarget, setRenewTarget] = useState<SubscriptionItem | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-subscriptions", page, limit, statusFilter],
    queryFn: () =>
      fetchSubscriptions({ page, limit, status: statusFilter || undefined }),
  });

  const subscriptions = data?.docs || [];
  const totalPages = data?.totalPages || 1;

  const mCreate = useMutation({
    mutationFn: (data: {
      userId: string;
      appId: string;
      subPackageId: string;
    }) => createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      setShowCreate(false);
      notify("Tạo subscription thành công!", "success");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Lỗi khi tạo subscription!";
      notify(msg, "error");
    },
  });

  const mRenew = useMutation({
    mutationFn: ({ id, packageId }: { id: string; packageId: string }) =>
      renewSubscription(id, packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      setRenewTarget(null);
      notify("Gia hạn thành công!", "success");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Lỗi khi gia hạn!";
      notify(msg, "error");
    },
  });

  const mCancel = useMutation({
    mutationFn: (id: string) => cancelSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      notify("Hủy subscription thành công!", "success");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Lỗi khi hủy subscription!";
      notify(msg, "error");
    },
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      setDeleteTarget(null);
      notify("Xóa subscription thành công!", "success");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Lỗi khi xóa subscription!";
      notify(msg, "error");
    },
  });

  return {
    isAdmin,
    isAuthLoading,
    subscriptions,
    isLoading,
    showCreate,
    setShowCreate,
    deleteTarget,
    setDeleteTarget,
    renewTarget,
    setRenewTarget,
    toast,
    mCreate,
    mRenew,
    mCancel,
    mDelete,
    page,
    setPage,
    totalPages,
    statusFilter,
    setStatusFilter,
  };
}
