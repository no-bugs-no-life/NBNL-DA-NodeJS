"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";
import {
  fetchApps,
  fetchAppById,
  approveApp,
  rejectApp,
  publishApp,
  deleteApp,
  createApp,
  updateApp,
  toggleDisableApp,
  AppItem,
  AppInput,
} from "./appsService";

export function useAdminApps() {
  const { token, isAdmin, isLoading: isAuthLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("published");

  const [actionTarget, setActionTarget] = useState<{
    app: AppItem;
    action: "approve" | "reject" | "delete" | "publish";
  } | null>(null);
  const [formTarget, setFormTarget] = useState<{
    app?: AppItem;
    action: "create" | "edit";
  } | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const {
    data: appsData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["apps", page, limit, filterStatus],
    queryFn: () => fetchApps(page, limit, filterStatus, token),
  });

  const apps = appsData?.docs || [];
  const totalPages = appsData?.totalPages || 1;
  const totalDocs = appsData?.totalDocs || 0;

  const mApprove = useMutation({
    mutationFn: (id: string) => approveApp(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      setActionTarget(null);
      notify("Duyệt App thành công!", "success");
    },
    onError: () => notify("Lỗi khi duyệt App!", "error"),
  });

  const mReject = useMutation({
    mutationFn: (id: string) => rejectApp(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      setActionTarget(null);
      notify("Từ chối App thành công!", "success");
    },
    onError: () => notify("Lỗi khi từ chối App!", "error"),
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => deleteApp(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      setActionTarget(null);
      notify("Xoá App thành công!", "success");
    },
    onError: () => notify("Lỗi khi xoá App!", "error"),
  });

  const mPublish = useMutation({
    mutationFn: (id: string) => publishApp(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      setActionTarget(null);
      notify("Phát hành App thành công!", "success");
    },
    onError: () => notify("Lỗi khi phát hành App!", "error"),
  });

  const mCreate = useMutation({
    mutationFn: (data: AppInput) => createApp(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      setFormTarget(null);
      notify("Thêm ứng dụng thành công!", "success");
    },
    onError: () => notify("Lỗi khi thêm ứng dụng!", "error"),
  });

  const mUpdate = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AppInput }) =>
      updateApp(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      setFormTarget(null);
      notify("Cập nhật ứng dụng thành công!", "success");
    },
    onError: () => notify("Lỗi khi cập nhật ứng dụng!", "error"),
  });

  return {
    isAdmin,
    isAuthLoading,
    apps,
    isLoading,
    actionTarget,
    setActionTarget,
    formTarget,
    setFormTarget,
    toast,
    mApprove,
    mReject,
    mPublish,
    mDelete,
    mCreate,
    mUpdate,
    page,
    setPage,
    totalPages,
    totalDocs,
    filterStatus,
    setFilterStatus,
    refetch,
    isFetching,
  };
}

export function useAdminAppDetail(id: string) {
  const { token, isAdmin, isLoading: isAuthLoading } = useAuthStore();
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data: app } = useQuery({
    queryKey: ["app", id],
    queryFn: () => fetchAppById(id, token),
    enabled: !!id,
  });

  const mApprove = useMutation({
    mutationFn: (appId: string) => approveApp(appId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app", id] });
      notify("Duyệt App thành công!", "success");
    },
    onError: () => notify("Lỗi khi duyệt App!", "error"),
  });

  const mReject = useMutation({
    mutationFn: (appId: string) => rejectApp(appId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app", id] });
      notify("Từ chối App thành công!", "success");
    },
    onError: () => notify("Lỗi khi từ chối App!", "error"),
  });

  const mDelete = useMutation({
    mutationFn: (appId: string) => deleteApp(appId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app", id] });
      notify("Xoá App thành công!", "success");
    },
    onError: () => notify("Lỗi khi xoá App!", "error"),
  });

  const mToggleDisable = useMutation({
    mutationFn: (appId: string) => toggleDisableApp(appId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app", id] });
      notify("Đổi trạng thái App thành công!", "success");
    },
    onError: () => notify("Lỗi khi đổi trạng thái App!", "error"),
  });

  const mUpdate = useMutation({
    mutationFn: ({ appId, data }: { appId: string; data: AppInput }) =>
      updateApp(appId, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app", id] });
      notify("Cập nhật ứng dụng thành công!", "success");
    },
    onError: () => notify("Lỗi khi cập nhật ứng dụng!", "error"),
  });

  return {
    isAdmin,
    isAuthLoading,
    app,
    mApprove,
    mReject,
    mDelete,
    mToggleDisable,
    mUpdate,
    toast,
  };
}
