"use client";
import { TagItem } from "@/hooks/useTags";
import { Pagination } from "@/components/ui/Pagination";

interface Props {
    tags: TagItem[];
    isLoading: boolean;
    onEdit: (tag: TagItem) => void;
    onDelete: (tag: TagItem) => void;
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}

export function TagTable({ tags, isLoading, onEdit, onDelete, page, totalPages, onPageChange }: Props) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-slate-500 bg-slate-50/50 border-b border-slate-100/50">
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 w-8">#</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600">Tên Tag</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600">Số lượng App</th>
                        <th className="text-right px-6 py-4 font-semibold text-slate-600">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? <LoadingRows /> : <DataRows tags={tags} onEdit={onEdit} onDelete={onDelete} />}
                </tbody>
            </table>

            {!isLoading && <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />}
        </div>
    );
}

function LoadingRows() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse border-b border-slate-50 lg:last:border-none">
                    <td colSpan={4} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                </tr>
            ))}
        </>
    );
}

function DataRows({ tags, onEdit, onDelete }: { tags: TagItem[], onEdit: (tag: TagItem) => void, onDelete: (tag: TagItem) => void }) {
    if (tags.length === 0) {
        return <tr><td colSpan={4} className="text-center py-16 text-slate-400">Chưa có tag nào.</td></tr>;
    }
    return (
        <>
            {tags.map((tag, idx) => (
                <tr key={tag._id} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-none">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800 capitalize">{tag.name}</td>
                    <td className="px-6 py-4 text-slate-600">{tag.appIds ? tag.appIds.length : 0}</td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={() => onEdit(tag)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm">edit</span> Sửa
                            </button>
                            <button onClick={() => onDelete(tag)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm">delete</span> Xoá
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}
