"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";
import {
  fetchReports,
  updateReportStatus,
  deleteReport,
  createReport,
  ReportItem,
  ReportStatus,
} from "./reportsService";

export function useAdminReports() {
  const { isAdmin, isLoading: isAuthLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "">("");
  const [targetTypeFilter, setTargetTypeFilter] = useState<
    "app" | "review" | ""
  >("");

  const [showCreate, setShowCreate] = useState(false);
  const [actionTarget, setActionTarget] = useState<ReportItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ReportItem | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const {
    data: reportsData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["admin-reports", page, limit, statusFilter, targetTypeFilter],
    queryFn: () =>
      fetchReports({
        page,
        limit,
        status: statusFilter || undefined,
        targetType: targetTypeFilter || undefined,
      }),
  });

  const reports = reportsData?.docs || [];
  const totalPages = reportsData?.totalPages || 1;
  const totalDocs = reportsData?.totalDocs || 0;

  const mCreate = useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      setShowCreate(false);
      notify("Tạo report thành công!", "success");
    },
    onError: (err: any) =>
      notify(err?.response?.data?.message || "Lỗi khi tạo report!", "error"),
  });

  const mUpdateStatus = useMutation({
    mutationFn: ({
      id,
      status,
      adminNote,
    }: {
      id: string;
      status: ReportStatus;
      adminNote?: string;
    }) => updateReportStatus(id, status, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      setActionTarget(null);
      notify("Cập nhật trạng thái thành công!", "success");
    },
    onError: (err: any) =>
      notify(err?.response?.data?.message || "Lỗi khi cập nhật!", "error"),
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      setDeleteTarget(null);
      notify("Xoá report thành công!", "success");
    },
    onError: (err: any) =>
      notify(err?.response?.data?.message || "Lỗi khi xoá!", "error"),
  });

  return {
    isAdmin,
    isAuthLoading,
    reports,
    isLoading,
    isFetching,
    totalDocs,
    showCreate,
    setShowCreate,
    actionTarget,
    setActionTarget,
    deleteTarget,
    setDeleteTarget,
    toast,
    mCreate,
    mUpdateStatus,
    mDelete,
    page,
    setPage,
    totalPages,
    statusFilter,
    setStatusFilter,
    targetTypeFilter,
    setTargetTypeFilter,
  };
}
