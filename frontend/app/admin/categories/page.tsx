"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import useAuthStore from "@/store/useAuthStore";
import { CategoryItem } from "@/hooks/useCategories";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getAuthHeaders(token: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---- API Functions ----
async function fetchCategories(): Promise<CategoryItem[]> {
  const res = await axios.get(`${API_URL}/api/v1/categories`);
  return res.data;
}

async function createCategory(data: { name: string; iconUrl?: string }, token: string | null) {
  const res = await axios.post(`${API_URL}/api/v1/categories`, data, {
    headers: getAuthHeaders(token),
  });
  return res.data;
}

async function updateCategory(id: string, data: { name: string; iconUrl?: string }, token: string | null) {
  const res = await axios.put(`${API_URL}/api/v1/categories/${id}`, data, {
    headers: getAuthHeaders(token),
  });
  return res.data;
}

async function deleteCategory(id: string, token: string | null) {
  const res = await axios.delete(`${API_URL}/api/v1/categories/${id}`, {
    headers: getAuthHeaders(token),
  });
  return res.data;
}

// ---- Modal Component ----
interface ModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (name: string, iconUrl: string) => void;
  initialName?: string;
  initialIconUrl?: string;
  loading?: boolean;
}

function CategoryModal({ title, onClose, onSubmit, initialName = "", initialIconUrl = "", loading }: ModalProps) {
  const [name, setName] = useState(initialName);
  const [iconUrl, setIconUrl] = useState(initialIconUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên danh mục <span className="text-red-500">*</span></label>
            <input
              id="category-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên danh mục..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Icon URL <span className="text-slate-400 font-normal">(tuỳ chọn)</span></label>
            <input
              id="category-icon-input"
              type="text"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            id="modal-cancel-btn"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            id="modal-submit-btn"
            onClick={() => onSubmit(name.trim(), iconUrl.trim())}
            disabled={!name.trim() || loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Confirm Delete Modal ----
function ConfirmModal({ name, onClose, onConfirm, loading }: { name: string; onClose: () => void; onConfirm: () => void; loading?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-red-500">delete</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800">Xác nhận xoá</h2>
          <p className="text-sm text-slate-500">Bạn có chắc muốn xoá danh mục <span className="font-semibold text-slate-700">&quot;{name}&quot;</span>? Hành động này không thể hoàn tác.</p>
        </div>
        <div className="flex gap-3">
          <button id="delete-cancel-btn" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
            Huỷ
          </button>
          <button id="delete-confirm-btn" onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
            {loading ? "Đang xoá..." : "Xoá"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Main Admin Page ----
export default function AdminCategoriesPage() {
  const { token, user, isAdmin } = useAuthStore();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<CategoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data: categories = [], isLoading } = useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; iconUrl?: string }) => createCategory(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowCreate(false);
      showToast("Tạo danh mục thành công!", "success");
    },
    onError: () => showToast("Lỗi khi tạo danh mục!", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string; iconUrl?: string }) =>
      updateCategory(data.id, { name: data.name, iconUrl: data.iconUrl }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditTarget(null);
      showToast("Cập nhật thành công!", "success");
    },
    onError: () => showToast("Lỗi khi cập nhật!", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteTarget(null);
      showToast("Xoá danh mục thành công!", "success");
    },
    onError: () => showToast("Lỗi khi xoá danh mục!", "error"),
  });

  // Access guard
  if (!isAdmin()) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-24 px-6 max-w-[1920px] mx-auto min-h-screen flex flex-col items-center justify-center gap-4">
          <span className="material-symbols-outlined text-6xl text-red-400">lock</span>
          <h1 className="text-2xl font-bold text-slate-700">Không có quyền truy cập</h1>
          <p className="text-slate-500 text-sm">Trang này chỉ dành cho ADMIN và MODERATOR.</p>
          {!user && (
            <p className="text-xs text-slate-400 mt-2">Bạn chưa đăng nhập. Hãy đăng nhập với tài khoản ADMIN.</p>
          )}
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24 px-6 max-w-5xl mx-auto min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Quản lý Danh mục</h1>
            <p className="text-slate-500 text-sm mt-1">
              {categories.length} danh mục · Admin Panel
            </p>
          </div>
          <button
            id="create-category-btn"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Thêm danh mục
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-4 font-semibold text-slate-600 w-8">#</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Tên danh mục</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Icon URL</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Parent</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100 animate-pulse">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr key={cat._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{cat.name}</td>
                    <td className="px-6 py-4 text-slate-400 max-w-[200px] truncate text-xs font-mono">
                      {cat.iconUrl || <span className="italic">—</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {cat.parentId ? (
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{typeof cat.parentId === "object" ? (cat.parentId as CategoryItem).name : cat.parentId}</span>
                      ) : (
                        <span className="italic text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          id={`edit-btn-${cat._id}`}
                          onClick={() => setEditTarget(cat)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Sửa
                        </button>
                        <button
                          id={`delete-btn-${cat._id}`}
                          onClick={() => setDeleteTarget(cat)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold transition-all ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          <span className="material-symbols-outlined text-base">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          {toast.message}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <CategoryModal
          title="Tạo danh mục mới"
          onClose={() => setShowCreate(false)}
          onSubmit={(name, iconUrl) => createMutation.mutate({ name, iconUrl })}
          loading={createMutation.isPending}
        />
      )}

      {/* Edit Modal */}
      {editTarget && (
        <CategoryModal
          title="Chỉnh sửa danh mục"
          initialName={editTarget.name}
          initialIconUrl={editTarget.iconUrl}
          onClose={() => setEditTarget(null)}
          onSubmit={(name, iconUrl) =>
            updateMutation.mutate({ id: editTarget._id, name, iconUrl })
          }
          loading={updateMutation.isPending}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
          loading={deleteMutation.isPending}
        />
      )}
    </>
  );
}
