"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSubPackages,
  createSubPackage,
  updateSubPackage,
  deleteSubPackage,
  SubPackageItem,
} from "./subPackagesService";
import useAuthStore from "@/store/useAuthStore";

export function useAdminSubPackages() {
  const { isAdmin, isLoading: isAuthLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<SubPackageItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubPackageItem | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [typeFilter, setTypeFilter] = useState("");

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data: pkgsData, isLoading } = useQuery({
    queryKey: ["admin-sub-packages", page, limit, typeFilter],
    queryFn: () =>
      fetchSubPackages({ page, limit, type: typeFilter || undefined }),
  });

  const packages = pkgsData?.docs || [];
  const totalPages = pkgsData?.totalPages || 1;

  const mCreate = useMutation({
    mutationFn: (data: Parameters<typeof createSubPackage>[0]) =>
      createSubPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sub-packages"] });
      setShowCreate(false);
      notify("Tạo gói thành công!", "success");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Lỗi khi tạo gói!";
      notify(msg, "error");
    },
  });

  const mUpdate = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateSubPackage>[1];
    }) => updateSubPackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sub-packages"] });
      setEditTarget(null);
      notify("Cập nhật gói thành công!", "success");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Lỗi khi cập nhật gói!";
      notify(msg, "error");
    },
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => deleteSubPackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sub-packages"] });
      setDeleteTarget(null);
      notify("Xóa gói thành công!", "success");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Lỗi khi xóa gói!";
      notify(msg, "error");
    },
  });

  return {
    isAdmin,
    isAuthLoading,
    packages,
    isLoading,
    showCreate,
    setShowCreate,
    editTarget,
    setEditTarget,
    deleteTarget,
    setDeleteTarget,
    toast,
    mCreate,
    mUpdate,
    mDelete,
    page,
    setPage,
    totalPages,
    typeFilter,
    setTypeFilter,
  };
}
