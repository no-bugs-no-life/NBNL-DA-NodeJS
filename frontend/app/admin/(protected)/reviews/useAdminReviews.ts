"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";
import {
  fetchReviews,
  approveReview,
  rejectReview,
  deleteReview,
  resetReview,
  createReviewAdmin,
  updateReviewAdmin,
  ReviewItem,
  ReviewInput,
} from "./reviewsService";

export function useAdminReviews() {
  const { token, isAdmin, isLoading: isAuthLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isPendingFilter, setIsPendingFilter] = useState(true);

  const [actionTarget, setActionTarget] = useState<{
    review: ReviewItem;
    action: "approve" | "reject" | "delete" | "reset";
  } | null>(null);
  const [formTarget, setFormTarget] = useState<{
    action: "create" | "edit";
    review?: ReviewItem;
  } | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["reviews", page, limit, isPendingFilter],
    queryFn: () => fetchReviews(page, limit, isPendingFilter),
  });

  const reviews = reviewsData?.docs || [];
  const totalPages = reviewsData?.totalPages || 1;
  const totalDocs = reviewsData?.totalDocs || 0;

  const mApprove = useMutation({
    mutationFn: (id: string) => approveReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setActionTarget(null);
      notify("Duyệt đánh giá thành công!", "success");
    },
    onError: () => notify("Lỗi khi duyệt đánh giá!", "error"),
  });

  const mReject = useMutation({
    mutationFn: (id: string) => rejectReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setActionTarget(null);
      notify("Từ chối đánh giá thành công!", "success");
    },
    onError: () => notify("Lỗi khi từ chối đánh giá!", "error"),
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setActionTarget(null);
      notify("Xoá đánh giá thành công!", "success");
    },
    onError: () => notify("Lỗi khi xoá đánh giá!", "error"),
  });

  const mReset = useMutation({
    mutationFn: (id: string) => resetReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setActionTarget(null);
      notify("Chuyển về chờ duyệt thành công!", "success");
    },
    onError: () => notify("Lỗi khi chuyển trạng thái!", "error"),
  });

  const mCreate = useMutation({
    mutationFn: (data: ReviewInput) => createReviewAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setFormTarget(null);
      notify("Thêm đánh giá thành công!", "success");
    },
    onError: () => notify("Lỗi khi thêm đánh giá!", "error"),
  });

  const mUpdate = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ReviewInput> }) =>
      updateReviewAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setFormTarget(null);
      notify("Cập nhật đánh giá thành công!", "success");
    },
    onError: () => notify("Lỗi khi cập nhật đánh giá!", "error"),
  });

  return {
    isAdmin,
    isAuthLoading,
    reviews,
    isLoading,
    actionTarget,
    setActionTarget,
    formTarget,
    setFormTarget,
    toast,
    mApprove,
    mReject,
    mDelete,
    mReset,
    mCreate,
    mUpdate,
    page,
    setPage,
    totalPages,
    totalDocs,
    isPendingFilter,
    setIsPendingFilter,
  };
}
