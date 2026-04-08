"use client";
import { useMutation } from "@tanstack/react-query";
import useAuthStore, { apiClient, User } from "@/store/useAuthStore";
import { useState } from "react";

export function useProfileSettings() {
  const { user, checkAuth } = useAuthStore();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<User>) =>
      (await apiClient.patch("/api/v1/users/me", data)).data,
    onSuccess: async () => {
      await checkAuth();
      notify("Cập nhật thông tin thành công!", "success");
    },
    onError: () => notify("Có lỗi xảy ra khi cập nhật!", "error"),
  });

  return { user, updateMutation, toast };
}
