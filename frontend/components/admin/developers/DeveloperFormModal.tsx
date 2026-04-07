"use client";
import React, { useState } from "react";
import { Select } from "antd";
import "antd/dist/reset.css";
import { DeveloperItem } from "@/hooks/useDevelopers";
import { useUsers } from "@/hooks/useUsers";

interface Props {
  developer?: DeveloperItem;
  action: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: Partial<DeveloperItem>) => void;
  loading: boolean;
}

export function DeveloperFormModal({
  developer,
  action,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState({
    name: developer?.name || "",
    contactEmail: developer?.contactEmail || "",
    avatarUrl: developer?.avatarUrl || "",
    bio: developer?.bio || "",
    website: developer?.website || "",
    userId: "",
  });
  const [userOptions, setUserOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const handleUserSearch = (val: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const q = val.trim().toLowerCase();
      const filtered = users
        .filter((u) => {
          const email = (u.email || "").toLowerCase();
          const name = (u.fullName || u.username || "").toLowerCase();
          return email.includes(q) || name.includes(q);
        })
        .slice(0, 50)
        .map((u) => ({
          value: u._id,
          label: `${u.email}${u.fullName ? ` (${u.fullName})` : ""}`,
        }));
      setUserOptions(filtered);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === "create" && !formData.userId) return;
    onSubmit(formData as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {action === "create"
                ? "Thêm mới Developer"
                : "Chỉnh sửa Developer"}
            </h2>
            {action === "edit" && developer?.userId && (
              <p className="text-xs text-slate-500 mt-1">
                Gắn với Account: {developer.userId.email}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form
            id="developer-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {action === "create" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Chọn người dùng <span className="text-red-500">*</span>
                </label>
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Chọn tài khoản User"
                  value={formData.userId || undefined}
                  loading={isLoadingUsers}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  notFoundContent={null}
                  options={userOptions}
                  onSearch={handleUserSearch}
                  onChange={(val) =>
                    setFormData({ ...formData, userId: String(val || "") })
                  }
                />
                {!formData.userId && (
                  <p className="text-xs text-red-500 mt-1">Vui lòng chọn người dùng</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tên Developer
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Liên hệ <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) =>
                  setFormData({ ...formData, avatarUrl: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tiểu sử (Bio)
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
              />
            </div>
          </form>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Huỷ bỏ
          </button>
          <button
            type="submit"
            form="developer-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm min-w-[120px]"
          >
            {loading && (
              <span className="material-symbols-outlined animate-spin text-sm">
                progress_activity
              </span>
            )}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
