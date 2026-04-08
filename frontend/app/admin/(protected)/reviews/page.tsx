"use client";
import { ReviewTable } from "@/components/admin/reviews/ReviewTable";
import { ConfirmReviewModal } from "@/components/admin/reviews/ConfirmReviewModal";
import { ReviewFormModal } from "@/components/admin/reviews/ReviewFormModal";
import { useAdminReviews } from "./useAdminReviews";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
function TopBar({
  count,
  isPendingFilter,
  setPending,
  onAddClick,
}: {
  count: number;
  isPendingFilter: boolean;
  setPending: (b: boolean) => void;
  onAddClick: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Quản lý Đánh giá
        </h1>{" "}
        <p className="text-slate-500 text-sm mt-1">
          Hiển thị {count} đánh giá
        </p>{" "}
      </div>{" "}
      <div className="flex items-center gap-2">
        {" "}
        <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-slate-200">
          {" "}
          <button
            onClick={() => setPending(false)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${!isPendingFilter ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            {" "}
            Đã duyệt{" "}
          </button>{" "}
          <button
            onClick={() => setPending(true)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isPendingFilter ? "bg-amber-50 text-amber-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            {" "}
            Chờ duyệt{" "}
          </button>{" "}
        </div>{" "}
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm font-semibold transition-colors "
        >
          {" "}
          <span className="material-symbols-outlined text-sm">add</span> Thêm
          mới{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}
function ToastAlert({
  toast,
}: {
  toast: { message: string; type: string } | null;
}) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      {" "}
      <span className="material-symbols-outlined">
        {toast.type === "success" ? "check_circle" : "error"}
      </span>{" "}
      {toast.message}{" "}
    </div>
  );
}
export default function AdminReviewsPage() {
  const { checkAuth } = useAuthStore();
  const s = useAdminReviews();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (!s.isAuthLoading && !s.isAdmin()) {
    notFound();
  }
  if (s.isAuthLoading) return null;
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {" "}
      <TopBar
        count={s.totalDocs}
        isPendingFilter={s.isPendingFilter}
        setPending={(p) => {
          s.setIsPendingFilter(p);
          s.setPage(1);
        }}
        onAddClick={() => s.setFormTarget({ action: "create" })}
      />{" "}
      <ReviewTable
        reviews={s.reviews}
        isLoading={s.isLoading}
        isPendingFilter={s.isPendingFilter}
        onAction={(review, action) => {
          if (action === "edit") {
            s.setFormTarget({ action: "edit", review });
          } else {
            s.setActionTarget({ review, action });
          }
        }}
        page={s.page}
        totalPages={s.totalPages}
        onPageChange={s.setPage}
      />{" "}
      {s.actionTarget && (
        <ConfirmReviewModal
          review={s.actionTarget.review}
          action={s.actionTarget.action}
          onClose={() => s.setActionTarget(null)}
          onConfirm={() => {
            if (s.actionTarget?.action === "approve")
              s.mApprove.mutate(s.actionTarget.review._id);
            if (s.actionTarget?.action === "reject")
              s.mReject.mutate(s.actionTarget.review._id);
            if (s.actionTarget?.action === "reset")
              s.mReset.mutate(s.actionTarget.review._id);
            if (s.actionTarget?.action === "delete")
              s.mDelete.mutate(s.actionTarget.review._id);
          }}
          loading={
            s.mApprove.isPending ||
            s.mReject.isPending ||
            s.mDelete.isPending ||
            s.mReset.isPending
          }
        />
      )}{" "}
      {s.formTarget && (
        <ReviewFormModal
          review={s.formTarget.review}
          action={s.formTarget.action}
          onClose={() => s.setFormTarget(null)}
          onSubmit={(data) => {
            if (s.formTarget?.action === "create") s.mCreate.mutate(data);
            else if (s.formTarget?.action === "edit" && s.formTarget.review)
              s.mUpdate.mutate({ id: s.formTarget.review._id, data });
          }}
          loading={s.mCreate.isPending || s.mUpdate.isPending}
        />
      )}{" "}
      <ToastAlert toast={s.toast} />{" "}
    </div>
  );
}
