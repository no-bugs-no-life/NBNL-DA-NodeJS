"use client";
import React, { useState } from "react";
import { DeveloperTable } from "@/components/admin/developers/DeveloperTable";
import { DeveloperFormModal } from "@/components/admin/developers/DeveloperFormModal";
import { ApproveRejectModal } from "@/components/admin/developers/ApproveRejectModal";
import {
  useDevelopers,
  useCreateDeveloper,
  useUpdateDeveloper,
  useRevokeDeveloper,
  useApproveDeveloper,
  useRejectDeveloper,
  DeveloperItem,
} from "@/hooks/useDevelopers";

function TopBar({
  count,
  currentStatus,
  setStatus,
  onAddClick,
  onRefresh,
  isFetching,
}: {
  count: number;
  currentStatus: string;
  setStatus: (s: string) => void;
  onAddClick: () => void;
  onRefresh: () => void;
  isFetching?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Quản lý Developer</h1>
        <p className="text-slate-500 text-sm">Hiển thị {count} hồ sơ</p>
      </div>
      <div className="flex flex-col xl:flex-row xl:items-center gap-3">
        <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 overflow-x-auto whitespace-nowrap hide-scrollbar max-w-full">
          <button
            onClick={() => setStatus("")}
            className={`px-3 py-1.5 whitespace-nowrap rounded-lg text-sm font-semibold transition-all ${currentStatus === "" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setStatus("pending")}
            className={`px-3 py-1.5 whitespace-nowrap rounded-lg text-sm font-semibold transition-all ${currentStatus === "pending" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Chờ duyệt
          </button>
          <button
            onClick={() => setStatus("approved")}
            className={`px-3 py-1.5 whitespace-nowrap rounded-lg text-sm font-semibold transition-all ${currentStatus === "approved" ? "bg-white text-green-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Đã duyệt
          </button>
          <button
            onClick={() => setStatus("rejected")}
            className={`px-3 py-1.5 whitespace-nowrap rounded-lg text-sm font-semibold transition-all ${currentStatus === "rejected" ? "bg-white text-red-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Bị từ chối
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isFetching}
            className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
            title="Làm mới"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${isFetching ? "animate-spin text-blue-600" : ""}`}
            >
              refresh
            </span>
          </button>
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-sm">add</span> Thêm
            mới
          </button>
        </div>
      </div>
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
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold text-white transition-all animate-in slide-in-from-top-2 duration-300 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      <span className="material-symbols-outlined">
        {toast.type === "success" ? "check_circle" : "error"}
      </span>
      {toast.message}
    </div>
  );
}

export default function DevelopersPage() {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const { data: devsData, isLoading, refetch, isFetching } = useDevelopers(
    page,
    20,
    "createdAt",
    -1,
    filterStatus || undefined,
  );

  const createMutation = useCreateDeveloper();
  const updateMutation = useUpdateDeveloper();
  const revokeMutation = useRevokeDeveloper();
  const approveMutation = useApproveDeveloper();
  const rejectMutation = useRejectDeveloper();

  const [formTarget, setFormTarget] = useState<{
    dev?: DeveloperItem;
    action: "create" | "edit";
  } | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    dev: DeveloperItem;
    action: "approve" | "reject" | "revoke";
  } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null,
  );

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (
    dev: DeveloperItem,
    action: "edit" | "revoke" | "approve" | "reject",
  ) => {
    if (action === "edit") {
      setFormTarget({ dev, action: "edit" });
    } else if (action === "revoke") {
      if (
        confirm(`Bạn có chắc muốn thu hồi tài khoản developer "${dev.name}"?`)
      ) {
        revokeMutation
          .mutateAsync({ id: dev._id })
          .then(() => {
            showToast("Đã thu hồi quyền developer", "success");
            if (devsData?.docs.length === 1 && page > 1) setPage(page - 1);
          })
          .catch((err: any) =>
            showToast(err.response?.data?.msg || err.response?.data?.error || "Lỗi khi thu hồi", "error"),
          );
      }
    } else {
      setActionTarget({ dev, action });
    }
  };

  const handleSubmit = async (data: Partial<DeveloperItem>) => {
    try {
      if (formTarget?.action === "create") {
        await createMutation.mutateAsync(data);
        showToast("Thêm mới Developer thành công", "success");
      } else if (formTarget?.action === "edit" && formTarget.dev) {
        await updateMutation.mutateAsync({ id: formTarget.dev._id, data });
        showToast("Cập nhật thành công", "success");
      }
      setFormTarget(null);
    } catch (error: any) {
      showToast(
        error.response?.data?.msg ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Đã xảy ra lỗi",
        "error",
      );
    }
  };

  const isMutating = Boolean(
    createMutation.isPending ||
    updateMutation.isPending ||
    revokeMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending,
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <TopBar
        count={devsData?.totalDocs || 0}
        currentStatus={filterStatus}
        setStatus={(s) => {
          setFilterStatus(s);
          setPage(1);
        }}
        onAddClick={() => setFormTarget({ action: "create" })}
        onRefresh={refetch}
        isFetching={isFetching}
      />

      <DeveloperTable
        developers={devsData?.docs || []}
        isLoading={isLoading}
        onAction={handleAction}
        page={devsData?.page || 1}
        totalPages={devsData?.totalPages || 1}
        onPageChange={setPage}
      />

      <ToastAlert toast={toast} />

      {formTarget && (
        <DeveloperFormModal
          developer={formTarget.dev}
          action={formTarget.action}
          onClose={() => setFormTarget(null)}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {actionTarget &&
        (actionTarget.action === "approve" ||
          actionTarget.action === "reject") && (
          <ApproveRejectModal
            dev={actionTarget.dev}
            action={actionTarget.action}
            onClose={() => setActionTarget(null)}
            loading={approveMutation.isPending || rejectMutation.isPending}
            onApprove={async (permissions) => {
              try {
                await approveMutation.mutateAsync({
                  id: actionTarget.dev._id,
                  permissions,
                });
                showToast("Đã duyệt developer", "success");
                setActionTarget(null);
              } catch (err: any) {
                showToast(
                  err.response?.data?.msg || err.response?.data?.error || "Lỗi khi duyệt",
                  "error",
                );
              }
            }}
            onReject={async (reason) => {
              try {
                await rejectMutation.mutateAsync({
                  id: actionTarget.dev._id,
                  reason,
                });
                showToast("Đã từ chối developer", "success");
                setActionTarget(null);
              } catch (err: any) {
                showToast(
                  err.response?.data?.msg || err.response?.data?.error || "Lỗi khi từ chối",
                  "error",
                );
              }
            }}
          />
        )}
    </div>
  );
}
