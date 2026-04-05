"use client";
import React, { useState } from "react";
import { TagTable } from "@/components/admin/tags/TagTable";
import { TagFormModal } from "@/components/admin/tags/TagFormModal";
import { useTags, useCreateTag, useUpdateTag, useDeleteTag, TagItem } from "@/hooks/useTags";

export default function TagsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { data: tagsData, isLoading } = useTags(page, 20, search);

    const createMutation = useCreateTag();
    const updateMutation = useUpdateTag();
    const deleteMutation = useDeleteTag();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState<'create' | 'edit'>('create');
    const [selectedTag, setSelectedTag] = useState<TagItem | undefined>(undefined);

    const handleCreate = () => {
        setAction('create');
        setSelectedTag(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (tag: TagItem) => {
        setAction('edit');
        setSelectedTag(tag);
        setIsModalOpen(true);
    };

    const handleDelete = async (tag: TagItem) => {
        if (confirm(`Bạn có chắc muốn xoá tag "${tag.name}"?`)) {
            try {
                await deleteMutation.mutateAsync(tag._id);
                if (tagsData?.docs.length === 1 && page > 1) {
                    setPage(page - 1);
                }
            } catch (error: any) {
                alert(error.response?.data?.message || "Lỗi khi xoá");
            }
        }
    };

    const handleSubmit = async (data: { name: string }) => {
        try {
            if (action === 'create') {
                await createMutation.mutateAsync(data);
            } else if (action === 'edit' && selectedTag) {
                await updateMutation.mutateAsync({ id: selectedTag._id, data });
            }
            setIsModalOpen(false);
        } catch (error: any) {
            alert(error.response?.data?.message || "Đã xảy ra lỗi");
        }
    };

    const isMutating = Boolean(
        createMutation.isPending || (createMutation as any).isLoading ||
        updateMutation.isPending || (updateMutation as any).isLoading ||
        deleteMutation.isPending || (deleteMutation as any).isLoading
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Quản lý Tag</h1>
                    <p className="text-slate-500 mt-1">Quản lý và phân loại các thẻ ứng dụng</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm shadow-blue-200 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Thêm Tag mới
                </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="relative w-full sm:w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm tag..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                    />
                </div>
            </div>

            <TagTable
                tags={tagsData?.docs || []}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                page={tagsData?.page || 1}
                totalPages={tagsData?.totalPages || 1}
                onPageChange={setPage}
            />

            {isModalOpen && (
                <TagFormModal
                    tag={selectedTag}
                    action={action}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    loading={isMutating}
                />
            )}
        </div>
    );
}
