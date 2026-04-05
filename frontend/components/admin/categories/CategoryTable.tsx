"use client";
import { CategoryItem } from "@/hooks/useCategories";

interface Props {
    categories: CategoryItem[];
    isLoading: boolean;
    onEdit: (cat: CategoryItem) => void;
    onDelete: (cat: CategoryItem) => void;
}

export function CategoryTable({ categories, isLoading, onEdit, onDelete }: Props) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-slate-500 bg-slate-50/50 border-b border-slate-100/50">
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 w-8">#</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600">Tên danh mục</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600">Icon URL</th>
                        <th className="text-right px-6 py-4 font-semibold text-slate-600">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? <LoadingRows /> : <DataRows categories={categories} onEdit={onEdit} onDelete={onDelete} />}
                </tbody>
            </table>
        </div>
    );
}

function LoadingRows() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                </tr>
            ))}
        </>
    );
}

function DataRows({ categories, onEdit, onDelete }: { categories: CategoryItem[], onEdit: (cat: CategoryItem) => void, onDelete: (cat: CategoryItem) => void }) {
    if (categories.length === 0) {
        return <tr><td colSpan={5} className="text-center py-16 text-slate-400">Chưa có danh mục nào.</td></tr>;
    }
    return (
        <>
            {categories.map((cat, idx) => (
                <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{cat.name}</td>
                    <td className="px-6 py-4 text-slate-400 max-w-[200px] truncate text-xs font-mono">{cat.iconUrl || "—"}</td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(cat)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm">edit</span> Sửa
                            </button>
                            <button onClick={() => onDelete(cat)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm">delete</span> Xoá
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}
