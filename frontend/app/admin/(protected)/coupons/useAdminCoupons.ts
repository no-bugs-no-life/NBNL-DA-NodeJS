"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  CouponItem,
} from "./couponsService";

export function useAdminCoupons() {
  const { token, isAdmin, isLoading: isAuthLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<CouponItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CouponItem | null>(null);
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

  const { data: couponsData, isLoading } = useQuery({
    queryKey: ["coupons", page, limit],
    queryFn: () => fetchCoupons(page, limit),
    enabled: !!token,
  });

  const coupons = couponsData?.docs || [];
  const totalPages = couponsData?.totalPages || 1;

  const mCreate = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setShowCreate(false);
      notify("Tạo coupon thành công!", "success");
    },
    onError: (err: any) =>
      notify(err?.response?.data?.message || "Lỗi khi tạo coupon!", "error"),
  });

  const mUpdate = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateCoupon>[1];
    }) => updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setEditTarget(null);
      notify("Cập nhật thành công!", "success");
    },
    onError: (err: any) =>
      notify(err?.response?.data?.message || "Lỗi khi cập nhật!", "error"),
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setDeleteTarget(null);
      notify("Xoá coupon thành công!", "success");
    },
    onError: (err: any) =>
      notify(err?.response?.data?.message || "Lỗi khi xoá!", "error"),
  });

  return {
    isAdmin,
    isAuthLoading,
    coupons,
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
