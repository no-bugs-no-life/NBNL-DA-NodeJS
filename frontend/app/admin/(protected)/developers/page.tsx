"use client";
import React, { useState } from "react";
import { DeveloperTable } from "@/components/admin/developers/DeveloperTable";
import { DeveloperFormModal } from "@/components/admin/developers/DeveloperFormModal";
import {
  useDevelopers,
  useUpdateDeveloper,
  useDeleteDeveloper,
  useApproveDeveloper,
  useRejectDeveloper,
  DeveloperItem,
} from "@/hooks/useDevelopers";

export default function DevelopersPage() {
  const [page, setPage] = useState(1);
  const { data: devsData, isLoading } = useDevelopers(page, 20);

  const updateMutation = useUpdateDeveloper();
  const deleteMutation = useDeleteDeveloper();
  const approveMutation = useApproveDeveloper();
  const rejectMutation = useRejectDeveloper();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDev, setSelectedDev] = useState<DeveloperItem | undefined>(
    undefined,
  );

  const handleAction = async (
    dev: DeveloperItem,
    action: "edit" | "delete" | "approve" | "reject",
  ) => {
    if (action === "edit") {
      setSelectedDev(dev);
      setIsModalOpen(true);
    } else if (action === "delete") {
      if (confirm(`Bạn có chắc muốn xoá tài khoản developer "${dev.name}"?`)) {
        try {
          await deleteMutation.mutateAsync(dev._id);
          if (devsData?.docs.length === 1 && page > 1) {
            setPage(page - 1);
          }
        } catch (error: any) {
          alert(error.response?.data?.error || "Lỗi khi xoá");
        }
      }
    } else if (action === "approve") {
      if (confirm(`Duyệt tài khoản developer "${dev.name}"?`)) {
        try {
          await approveMutation.mutateAsync({ id: dev._id });
        } catch (error: any) {
          alert(error.response?.data?.error || "Lỗi khi duyệt");
        }
      }
    } else if (action === "reject") {
      const reason = prompt("Nhập lý do từ chối:");
      if (reason !== null) {
        try {
          await rejectMutation.mutateAsync({ id: dev._id, reason });
        } catch (error: any) {
          alert(error.response?.data?.error || "Lỗi khi từ chối");
        }
      }
    }
  };

  const handleSubmit = async (data: Partial<DeveloperItem>) => {
    try {
      if (selectedDev) {
        await updateMutation.mutateAsync({ id: selectedDev._id, data });
      }
      setIsModalOpen(false);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Đã xảy ra lỗi");
    }
  };

  const isMutating = Boolean(
    updateMutation.isPending ||
    deleteMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending,
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Quản lý Developer
        </h1>
        <p className="text-slate-500 mt-1">
          Quản lý hồ sơ nhà phát triển hệ thống trực thuộc User Accounts
        </p>
      </div>

      <DeveloperTable
        developers={devsData?.docs || []}
        isLoading={isLoading}
        onAction={handleAction}
        page={devsData?.page || 1}
        totalPages={devsData?.totalPages || 1}
        onPageChange={setPage}
      />

      {isModalOpen && selectedDev && (
        <DeveloperFormModal
          developer={selectedDev}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          loading={isMutating}
        />
      )}
    </div>
  );
}
