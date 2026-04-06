"use client";
import React, { useState, useEffect } from "react";
import { WishlistTable } from "@/components/admin/wishlists/WishlistTable";
import { WishlistDetailModal } from "@/components/admin/wishlists/WishlistDetailModal";
import {
  WishlistFormModal,
  WishlistFormInput,
} from "@/components/admin/wishlists/WishlistFormModal";
import { WishlistUpdateModal } from "@/components/admin/wishlists/WishlistUpdateModal";
import {
  useAdminWishlists,
  useDeleteWishlist,
  useCreateWishlistAdmin,
  useUpdateWishlistAdmin,
  WishlistItem,
} from "@/hooks/useWishlist";
import useAuthStore from "@/store/useAuthStore";

function TopBar({
  count,
  onAddClick,
  onRefresh,
  isFetching,
}: {
  count: number;
  onAddClick: () => void;
  onRefresh: () => void;
  isFetching?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Quản lý Wishlist</h1>
        <p className="text-slate-500 text-sm">Hiển thị {count} wishlist</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
          title="Làm mới"
        >
          <span className={`material-symbols-outlined text-[20px] ${isFetching ? "animate-spin text-blue-600" : ""}`}>
            refresh
          </span>
        </button>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span> Thêm
          mới
        </button>
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
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      <span className="material-symbols-outlined">
        {toast.type === "success" ? "check_circle" : "error"}
      </span>
      {toast.message}
    </div>
  );
}

export default function WishlistsAdminPage() {
  const { checkAuth } = useAuthStore();
  const [page, setPage] = useState(1);
  const [selectedWishlist, setSelectedWishlist] = useState<WishlistItem | null>(null);
  const [updateWishlist, setUpdateWishlist] = useState<WishlistItem | null>(null);
  const [removingAppId, setRemovingAppId] = useState<string | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const { data: wishlistsData, isLoading, isFetching, refetch } = useAdminWishlists(page, 20);
  const deleteMutation = useDeleteWishlist();
  const createMutation = useCreateWishlistAdmin();
  const updateMutation = useUpdateWishlistAdmin();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const showToast = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = async (wishlist: WishlistItem) => {
    if (!confirm(`Xoá wishlist của "${wishlist.userId?.fullName}"?`)) return;
    try {
      await deleteMutation.mutateAsync(wishlist._id);
      showToast("Xoá wishlist thành công!", "success");
      if (wishlistsData?.docs?.length === 1 && page > 1) setPage(page - 1);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(
        error.response?.data?.message || "Lỗi khi xoá wishlist",
        "error",
      );
    }
  };

  const handleCreate = async (data: WishlistFormInput) => {
    try {
      await createMutation.mutateAsync(data);
      showToast("Tạo wishlist thành công!", "success");
      setShowForm(false);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(
        error.response?.data?.message || "Lỗi khi tạo wishlist",
        "error",
      );
    }
  };

  const handleUpdate = async (data: WishlistFormInput) => {
    if (!updateWishlist) return;
    try {
      await updateMutation.mutateAsync({ id: updateWishlist._id, data });
      showToast("Cập nhật wishlist thành công!", "success");
      setUpdateWishlist(null);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(
        error.response?.data?.message || "Lỗi khi cập nhật wishlist",
        "error",
      );
    }
  };

  return (
    <>
      <TopBar
        count={wishlistsData?.totalDocs || 0}
        onAddClick={() => setShowForm(true)}
        onRefresh={refetch}
        isFetching={isFetching}
      />
      <WishlistTable
        wishlists={wishlistsData?.docs || []}
        isLoading={isLoading}
        onDelete={handleDelete}
        onView={(w) => setSelectedWishlist(w)}
        onUpdate={(w) => setUpdateWishlist(w)}
        page={wishlistsData?.page || 1}
        totalPages={wishlistsData?.totalPages || 1}
        onPageChange={setPage}
      />

      {selectedWishlist && (
        <WishlistDetailModal
          wishlist={selectedWishlist}
          onClose={() => setSelectedWishlist(null)}
          onRemoveApp={(appId) => {
            setRemovingAppId(appId);
            setTimeout(() => {
              setRemovingAppId(undefined);
              setSelectedWishlist(null);
            }, 800);
          }}
          removingAppId={removingAppId}
        />
      )}

      {showForm && (
        <WishlistFormModal
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          loading={createMutation.isPending}
        />
      )}

      {updateWishlist && (
        <WishlistUpdateModal
          wishlist={updateWishlist}
          onClose={() => setUpdateWishlist(null)}
          onSubmit={handleUpdate}
          loading={updateMutation.isPending}
        />
      )}

      <ToastAlert toast={toast} />
    </>
  );
}
