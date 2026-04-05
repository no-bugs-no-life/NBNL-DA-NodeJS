"use client";
import { useState } from "react";
import { AppItem, AppInput } from "@/app/admin/(protected)/apps/appsService";
import { useCategories } from "@/hooks/useCategories";
import { apiClient } from "@/store/useAuthStore";
import useAuthStore from "@/store/useAuthStore";

interface Props {
    app?: AppItem;
    action: 'create' | 'edit';
    onClose: () => void;
    onSubmit: (data: AppInput) => void;
    loading: boolean;
}

export function AppFormModal({ app, action, onClose, onSubmit, loading }: Props) {
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
    const { user } = useAuthStore();

    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreviewUrl, setIconPreviewUrl] = useState<string>(app?.iconUrl || "");
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<AppInput>(() => {
        if (app && action === 'edit') {
            return {
                name: app.name || "",
                slug: app.slug || "",
                description: "", // Description usually not eagerly loaded in admin list
                price: app.price || 0,
                categoryId: app.categoryId?._id || "",
                iconUrl: app.iconUrl || ""
            };
        }
        return {
            name: "",
            slug: "",
            description: "",
            price: 0,
            categoryId: "",
            iconUrl: ""
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
        formPayload.append('file', file);
        formPayload.append('ownerType', 'APP');
        formPayload.append('ownerId', app?._id || user?._id || 'ADMIN');
        formPayload.append('fileType', 'icon');

        const res = await apiClient.post('/api/v1/files/upload-image', formPayload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data._id; // returns filesId
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
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">
                        {action === 'create' ? 'Thêm Ứng dụng mới' : 'Chỉnh sửa Ứng dụng'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <form id="app-form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên ứng dụng</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                    placeholder="Ví dụ: Flappy Bird"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Slug (URL)</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                        placeholder="vi-du-flappy-bird"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giá bán ($)</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                        placeholder="0 = Miễn phí"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Danh mục</label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    disabled={isLoadingCategories}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
                                >
                                    <option value="" disabled>Chọn danh mục...</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mô tả ngăn</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
                                    placeholder="Điền mô tả ngắn cho ứng dụng..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Ảnh màn hình Icon</label>
                                <div className="flex items-center gap-5">
                                    {iconPreviewUrl ? (
                                        <img src={iconPreviewUrl} alt="Icon preview" className="w-16 h-16 rounded-xl object-cover border-2 border-slate-100 shadow-sm bg-slate-50" />
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
                        {isSubmitting && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                        {uploading ? 'Đang tải icon...' : (action === 'create' ? 'Lưu ứng dụng' : 'Cập nhật')}
                    </button>
                </div>
            </div>
        </div>
    );
}
