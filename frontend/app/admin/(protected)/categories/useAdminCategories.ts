"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categoriesService";
import { CategoryItem } from "@/hooks/useCategories";

export function useAdminCategories() {
  const { token, isAdmin, isLoading: isAuthLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<CategoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories", page, limit],
    queryFn: () => fetchCategories(page, limit),
  });

  const categories = categoriesData?.docs || [];
  const totalPages = categoriesData?.totalPages || 1;

  const mCreate = useMutation({
    mutationFn: (data: { name: string; iconUrl?: string }) =>
      createCategory(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowCreate(false);
      notify("Tạo danh mục thành công!", "success");
    },
    onError: () => notify("Lỗi khi tạo danh mục!", "error"),
  });

  const mUpdate = useMutation({
    mutationFn: (data: { id: string; name: string; iconUrl?: string }) =>
      updateCategory(data.id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditTarget(null);
      notify("Cập nhật thành công!", "success");
    },
    onError: () => notify("Lỗi khi cập nhật!", "error"),
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => deleteCategory(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteTarget(null);
      notify("Xoá thành công!", "success");
    },
    onError: () => notify("Lỗi khi xoá!", "error"),
  });

  return {
    isAdmin,
    isAuthLoading,
    categories,
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
  };
}
