"use client";
import { DeveloperItem } from "@/hooks/useDevelopers";
import { Pagination } from "@/components/ui/Pagination";

interface Props {
    developers: DeveloperItem[];
    isLoading: boolean;
    onEdit: (dev: DeveloperItem) => void;
    onDelete: (dev: DeveloperItem) => void;
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}

export function DeveloperTable({ developers, isLoading, onEdit, onDelete, page, totalPages, onPageChange }: Props) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-slate-500 bg-slate-50/50 border-b border-slate-100/50">
                        <th className="text-left px-6 py-4 font-semibold text-slate-600">Developer Profile</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600">Bio / Website</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600">Tổng App</th>
                        <th className="text-right px-6 py-4 font-semibold text-slate-600">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? <LoadingRows /> : <DataRows developers={developers} onEdit={onEdit} onDelete={onDelete} />}
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

function DataRows({ developers, onEdit, onDelete }: { developers: DeveloperItem[], onEdit: (dev: DeveloperItem) => void, onDelete: (dev: DeveloperItem) => void }) {
    if (developers.length === 0) {
        return <tr><td colSpan={4} className="text-center py-16 text-slate-400">Chưa có developer nào.</td></tr>;
    }

    return (
        <>
            {developers.map((dev) => (
                <tr key={dev._id} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-none">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                <img src={dev.avatarUrl || "https://i.sstatic.net/l60Hf.png"} alt={dev.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">{dev.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">User: {dev.userId?.email || "N/A"}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 max-w-[250px]">
                        <p className="text-slate-600 text-xs line-clamp-1 mb-1" title={dev.bio}>{dev.bio || "Chưa có bio"}</p>
                        {dev.website && (
                            <a href={dev.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-[11px] font-mono hover:underline line-clamp-1 block">
                                {dev.website}
                            </a>
                        )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                        {dev.apps ? dev.apps.length : 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={() => onEdit(dev)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm">edit</span> Sửa
                            </button>
                            <button onClick={() => onDelete(dev)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm">delete</span> Xoá
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}
