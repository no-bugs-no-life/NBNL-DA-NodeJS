"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { AppItem, AppInput } from "@/app/admin/(protected)/apps/appsService";
import { useCategories } from "@/hooks/useCategories";
import { useDevelopers } from "@/hooks/useDevelopers";
import { useTags } from "@/hooks/useTags";
import { apiClient } from "@/store/useAuthStore";
import useAuthStore from "@/store/useAuthStore";
import { API_URL } from "@/configs/api";
import ClassicEditor from "ckeditor5-custom-build-v5-full";

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false },
);

const getIconDisplayUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("via.placeholder.com")) return "";
  if (
    url.startsWith("http") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  )
    return url;
  if (/^[a-fA-F0-9]{24}$/.test(url)) return ""; // Broken old ObjectID, require reupload
  return `${API_URL}/${url.replace(/\\/g, "/")}`;
};

interface Props {
  app?: AppItem;
  action: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: AppInput) => void;
  loading: boolean;
}

export function AppFormModal({
  app,
  action,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();
  const { data: devsData, isLoading: isLoadingDevs } = useDevelopers(
    1,
    1000,
    "name",
    1,
    "approved",
  );
  const developers = devsData?.docs || [];

  const { data: tagsData, isLoading: isLoadingTags } = useTags(1, 1000);
  const tagsList = tagsData?.docs || [];

  const { user } = useAuthStore();
  const isAdmin =
    typeof user?.role === "object"
      ? (user.role as any).name === "ADMIN"
      : user?.role === "ADMIN";

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string>(() => {
    return getIconDisplayUrl(app?.iconUrl || "");
  });
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<AppInput>(() => {
    if (app && action === "edit") {
      return {
        name: app.name || "",
        slug: app.slug || "",
        description: (app as any).description || "",
        price: app.price || 0,
        category: app.category?._id || "",
        tags: app.tags?.map((t: any) => t._id) || [],
        iconUrl: app.iconUrl || "",
        developer: app.developer?._id || "",
      };
    }
    return {
      name: "",
      slug: "",
      description: "",
      price: 0,
      category: "",
      tags: [],
      iconUrl: "",
      developer: "",
    };
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadFile = async (file: File) => {
    const formPayload = new FormData();
    formPayload.append("file", file);
    formPayload.append("ownerType", "APP");
    formPayload.append("ownerId", app?._id || user?._id || "ADMIN");
    formPayload.append("fileType", "icon");

    const res = await apiClient.post(
      "/api/v1/files/upload-image",
      formPayload,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data.url.replace(/\\/g, "/"); // return URL instead of local filesId
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalIconUrl = formData.iconUrl;

    if (iconFile) {
      try {
        setUploading(true);
        finalIconUrl = await uploadFile(iconFile);
      } catch (error) {
        console.error("Icon upload failed", error);
        setUploading(false);
        return; // Prevent submission if upload fails
      }
    }

    setUploading(false);
    onSubmit({ ...formData, iconUrl: finalIconUrl });
  };

  const isSubmitting = loading || uploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {action === "create" ? "Thêm Ứng dụng mới" : "Chỉnh sửa Ứng dụng"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="app-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {isAdmin && action === "create" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Workspace (Developer)
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.developer || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, developer: e.target.value })
                    }
                    disabled={isLoadingDevs}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
                  >
                    <option value="" disabled>
                      -- Chọn Workspace (Developer Profile) --
                    </option>
                    {developers.map((d: any) => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.contactEmail})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Tên ứng dụng
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                  placeholder="Ví dụ: Flappy Bird"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Slug (URL)
                </label>
                <input
                  required
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                  placeholder="vi-du-flappy-bird"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Giá bán ($)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                  placeholder="0 = Miễn phí"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Danh mục
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  disabled={isLoadingCategories}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
                >
                  <option value="" disabled>
                    Chọn danh mục...
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                  {isLoadingTags ? (
                    <span className="text-sm text-slate-500 px-2">
                      Đang tải tags...
                    </span>
                  ) : tagsList.length === 0 ? (
                    <span className="text-sm text-slate-500 px-2">
                      Chưa có tag nào
                    </span>
                  ) : (
                    tagsList.map((tag: any) => (
                      <label
                        key={tag._id}
                        className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.tags?.includes(tag._id) || false}
                          onChange={(e) => {
                            const newTags = e.target.checked
                              ? [...(formData.tags || []), tag._id]
                              : (formData.tags || []).filter(
                                (id) => id !== tag._id,
                              );
                            setFormData({ ...formData, tags: newTags });
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-slate-700 select-none">
                          {tag.name}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Mô tả
                </label>
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.description || ""}
                    onChange={(_, editor) =>
                      setFormData({ ...formData, description: editor.getData() })
                    }
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ảnh màn hình Icon
                </label>
                <div className="flex items-center gap-5">
                  {iconPreviewUrl ? (
                    <img
                      src={iconPreviewUrl}
                      alt="Icon preview"
                      className="w-16 h-16 rounded-xl object-cover border-2 border-slate-100 shadow-sm bg-slate-50"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-colors w-full"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Huỷ bỏ
          </button>
          <button
            type="submit"
            form="app-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {isSubmitting && (
              <span className="material-symbols-outlined animate-spin text-sm">
                progress_activity
              </span>
            )}
            {uploading
              ? "Đang tải icon..."
              : action === "create"
                ? "Lưu ứng dụng"
                : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
}
