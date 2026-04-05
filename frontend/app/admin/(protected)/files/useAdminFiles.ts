"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";
import {
  fetchFiles,
  updateFile,
  deleteFile,
  uploadFile,
  createFile,
} from "./filesService";
import { CreatePayload } from "@/components/admin/files/FileUploadModal";
import { FileItem } from "@/hooks/useFiles";

export function useAdminFiles() {
  const { token, isAdmin, isLoading: isAuthLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<FileItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FileItem | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [ownerTypeFilter, setOwnerTypeFilter] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("");

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data: filesData, isLoading } = useQuery({
    queryKey: ["admin-files", page, limit, ownerTypeFilter, fileTypeFilter],
    queryFn: () =>
      fetchFiles({
        page,
        limit,
        ownerType: ownerTypeFilter,
        fileType: fileTypeFilter,
      }),
  });

  const files = filesData?.docs || [];
  const totalPages = filesData?.totalPages || 1;

  const mUpdate = useMutation({
    mutationFn: (data: { id: string; fileType: string; url: string }) =>
      updateFile(data.id, { fileType: data.fileType, url: data.url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-files"] });
      setEditTarget(null);
      notify("Cập nhật thành công!", "success");
    },
    onError: () => notify("Lỗi khi cập nhật!", "error"),
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-files"] });
      setDeleteTarget(null);
      notify("Xoá file thành công!", "success");
    },
    onError: () => notify("Lỗi khi xoá file!", "error"),
  });

  const mCreate = useMutation({
    mutationFn: (payload: CreatePayload) =>
      payload.type === "manual"
        ? createFile(payload.data)
        : uploadFile(payload.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-files"] });
      setShowCreate(false);
      notify("Tải file lên thành công!", "success");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Lỗi khi tải file!";
      notify(message, "error");
    },
  });

  return {
    isAdmin,
    isAuthLoading,
    files,
    isLoading,
    showCreate,
    setShowCreate,
    editTarget,
    setEditTarget,
    deleteTarget,
    setDeleteTarget,
    toast,
    mUpdate,
    mDelete,
    mCreate,
    page,
    setPage,
    totalPages,
    ownerTypeFilter,
    setOwnerTypeFilter,
    fileTypeFilter,
    setFileTypeFilter,
  };
}
