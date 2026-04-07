"use client";
import React, { useState } from "react";
import { CartTable } from "@/components/admin/carts/CartTable";
import { CartDetailModal } from "@/components/admin/carts/CartDetailModal";
import { useAdminCarts, useDeleteCart, CartItem } from "@/hooks/useCart";
import { useUsers } from "@/hooks/useUsers";
import { useAdminApps } from "@/hooks/useAdminApps";
import axios from "axios";
import { API_URL } from "@/configs/api";
export default function CartsAdminPage() {
  const [page, setPage] = useState(1);
  const [selectedCart, setSelectedCart] = useState<CartItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [removingAppId, setRemovingAppId] = useState<string | undefined>();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null,
  );
  const { data: cartsData, isLoading } = useAdminCarts(page, 20);
  const deleteMutation = useDeleteCart();
  const showToast = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  const handleDelete = async (cart: CartItem) => {
    if (!confirm(`Xoá giỏ hàng của "${cart.user?.fullName}"?`)) return;
    try {
      await deleteMutation.mutateAsync(cart._id);
      if (selectedCart?._id === cart._id) setSelectedCart(null);
      showToast("Xoá giỏ hàng thành công!", "success");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(
        error.response?.data?.message || "Lỗi khi xoá giỏ hàng",
        "error",
      );
    }
  };
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {" "}
      <PageHeader onCreate={() => setShowCreateModal(true)} />{" "}
      <CartTable
        carts={cartsData?.docs || []}
        isLoading={isLoading}
        onView={setSelectedCart}
        onDelete={handleDelete}
        page={cartsData?.page || 1}
        totalPages={cartsData?.totalPages || 1}
        onPageChange={setPage}
      />{" "}
      {selectedCart && (
        <CartDetailModal
          cart={selectedCart}
          onClose={() => setSelectedCart(null)}
          onRemoveItem={(appId) => {
            setRemovingAppId(appId);
            setTimeout(() => {
              setRemovingAppId(undefined);
              setSelectedCart(null);
            }, 800);
          }}
          removingAppId={removingAppId}
        />
      )}{" "}
      {showCreateModal && (
        <CreateCartModal onClose={() => setShowCreateModal(false)} />
      )}{" "}
      <ToastAlert toast={toast} />{" "}
    </div>
  );
}
function PageHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Quản lý Giỏ hàng
        </h1>{" "}
        <p className="text-slate-500 text-sm mt-1">
          Xem và quản lý giỏ hàng của người dùng
        </p>{" "}
      </div>{" "}
      <button
        onClick={onCreate}
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm font-semibold transition-colors "
      >
        {" "}
        <span className="material-symbols-outlined text-sm">add</span> Tạo mới
        Cart{" "}
      </button>{" "}
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
// ===== Create Cart Modal =====
function CreateCartModal({ onClose }: { onClose: () => void }) {
  const { data: users } = useUsers();
  const { data: apps = [], isLoading: loadingApps } = useAdminApps();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  const [itemType, setItemType] = useState<string>("one_time");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    setSelectedAppId("");
  };

  const handleSubmit = async () => {
    if (!selectedUserId || !selectedAppId) return;
    setIsSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/v1/carts/admin/${selectedUserId}/items`,
        { appId: selectedAppId, itemType },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      window.location.reload();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Lỗi khi tạo cart");
    }
    setIsSubmitting(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {" "}
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {" "}
        <ModalHeader onClose={onClose} />{" "}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {" "}
          {/* Step 1: Select User */}{" "}
          <SelectUserStep
            users={users || []}
            selectedUserId={selectedUserId}
            onChange={handleUserChange}
          />{" "}
          {/* Step 2: Select App */}{" "}
          {selectedUserId && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                2. Chọn Ứng dụng
              </label>
              {loadingApps ? (
                <div className="text-sm text-slate-400 py-2">
                  Đang tải danh sách ứng dụng...
                </div>
              ) : apps.length === 0 ? (
                <div className="text-sm text-slate-400 py-2">
                  Không có ứng dụng nào.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {apps.map((app) => {
                    const isSelected = selectedAppId === app._id;
                    return (
                      <button
                        key={app._id}
                        type="button"
                        onClick={() => setSelectedAppId(app._id)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all text-sm ${
                          isSelected
                            ? "border-blue-400 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <AppIcon iconUrl={app.iconUrl} name={app.name} />
                        <span className="font-medium text-slate-700 truncate flex-1">
                          {app.name}
                        </span>
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-blue-600 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}{" "}
          {/* Step 3: Select Type */}{" "}
          {selectedAppId && (
            <SelectTypeStep itemType={itemType} onTypeChange={setItemType} />
          )}{" "}
          {error && <p className="text-sm text-red-500">{error}</p>}{" "}
        </div>{" "}
        <ModalFooter
          disabled={!selectedUserId || !selectedAppId || isSubmitting}
          isSubmitting={isSubmitting}
          onClose={onClose}
          onSubmit={handleSubmit}
        />{" "}
      </div>{" "}
    </div>
  );
}
function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
      {" "}
      <div>
        {" "}
        <h2 className="text-xl font-bold text-slate-800">
          Tạo Cart cho User
        </h2>{" "}
        <p className="text-xs text-slate-500 mt-1">
          Admin thêm app vào giỏ hàng của user
        </p>{" "}
      </div>{" "}
      <button
        onClick={onClose}
        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
      >
        {" "}
        <span className="material-symbols-outlined text-xl">close</span>{" "}
      </button>{" "}
    </div>
  );
}
function SelectUserStep({
  users,
  selectedUserId,
  onChange,
}: {
  users: {
    _id: string;
    fullName?: string;
    username?: string;
    email?: string;
  }[];
  selectedUserId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      {" "}
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        1. Chọn User
      </label>{" "}
      <select
        value={selectedUserId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white"
      >
        {" "}
        <option value="">-- Chọn user --</option>{" "}
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.fullName || u.username} ({u.email})
          </option>
        ))}{" "}
      </select>{" "}
    </div>
  );
}
function AppIcon({ iconUrl, name }: { iconUrl?: string; name: string }) {
  const getImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  if (iconUrl)
    return (
      <img
        src={getImageUrl(iconUrl)}
        alt={name}
        className="w-6 h-6 rounded-lg object-cover bg-slate-100 shrink-0"
      />
    );
  return (
    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
      {" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3.5 h-3.5 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>{" "}
    </div>
  );
}

// Bỏ SelectAppStep
function SelectTypeStep({
  itemType,
  onTypeChange,
}: {
  itemType: string;
  onTypeChange: (v: string) => void;
}) {
  return (
    <div>
      {" "}
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        3. Loại mua hàng (áp dụng chung)
      </label>{" "}
      <div className="space-y-2">
        {" "}
        <label
          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${itemType === "one_time" ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}
        >
          {" "}
          <input
            type="radio"
            name="itemType"
            value="one_time"
            checked={itemType === "one_time"}
            onChange={() => onTypeChange("one_time")}
            className="accent-blue-600"
          />{" "}
          <div>
            {" "}
            <p className="font-semibold text-sm text-slate-800">
              Mua một lần
            </p>{" "}
            <p className="text-xs text-slate-500">Sở hữu vĩnh viễn</p>{" "}
          </div>{" "}
        </label>{" "}
        <label
          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${itemType === "subscription" ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}
        >
          {" "}
          <input
            type="radio"
            name="itemType"
            value="subscription"
            checked={itemType === "subscription"}
            onChange={() => onTypeChange("subscription")}
            className="accent-blue-600"
          />{" "}
          <div>
            {" "}
            <p className="font-semibold text-sm text-slate-800">Đăng ký</p>{" "}
            <p className="text-xs text-slate-500">Hủy bất kỳ lúc nào</p>{" "}
          </div>{" "}
        </label>{" "}
      </div>{" "}
    </div>
  );
}
function ModalFooter({
  disabled,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  disabled: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
      {" "}
      <button
        onClick={onClose}
        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
      >
        {" "}
        Huỷ{" "}
      </button>{" "}
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="flex-1 px-4 py-2.5 rounded-xl bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {" "}
        {isSubmitting && (
          <span className="material-symbols-outlined text-sm animate-spin">
            progress_activity
          </span>
        )}{" "}
        Tạo Cart{" "}
      </button>{" "}
    </div>
  );
}
