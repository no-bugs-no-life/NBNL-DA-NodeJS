"use client";
import { AppItem } from "@/app/admin/(protected)/apps/appsService";

interface Props {
    apps: AppItem[];
    isLoading: boolean;
    onAction: (app: AppItem, action: 'approve' | 'reject' | 'delete') => void;
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}

export function AppTable({ apps, isLoading, onAction, page, totalPages, onPageChange }: Props) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-slate-500 bg-slate-50/50 border-b border-slate-100/50">
                        <th className="text-left px-6 py-4 font-semibold text-slate-600">Ứng dụng</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600">Tác giả</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600">Danh mục</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600">Trạng thái</th>
                        <th className="text-right px-6 py-4 font-semibold text-slate-600">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? <LoadingRows /> : <DataRows apps={apps} onAction={onAction} />}
                </tbody>
            </table>

            {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500">Trang {page} / {totalPages}</span>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => onPageChange(page - 1)}
                            className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >Trang trước</button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => onPageChange(page + 1)}
                            className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >Trang sau</button>
                    </div>
                </div>
            )}
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

function DataRows({ apps, onAction }: { apps: AppItem[], onAction: (app: AppItem, action: 'approve' | 'reject' | 'delete') => void }) {
    if (apps.length === 0) {
        return <tr><td colSpan={5} className="text-center py-16 text-slate-400">Không tìm thấy ứng dụng nào.</td></tr>;
    }

    return (
        <>
            {apps.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            {app.iconUrl ? (
                                <img src={app.iconUrl} alt={app.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-400">apps</span>
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-slate-800">{app.name}</h3>
                                <p className="text-xs text-slate-500">{app.price === 0 ? "Miễn phí" : `${app.price.toLocaleString('vi-VN')} đ`}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <p className="font-medium text-slate-700">{app.developerId?.fullName || "N/A"}</p>
                        <p className="text-xs text-slate-400">{app.developerId?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                            {app.categoryId?.name || "N/A"}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        {app.status === 'published' && <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs font-semibold">Đã xuất bản</span>}
                        {app.status === 'pending' && <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-semibold">Chờ duyệt</span>}
                        {app.status === 'rejected' && <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs font-semibold">Đã từ chối</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {app.status === 'pending' && (
                                <>
                                    <button onClick={() => onAction(app, 'approve')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-xs font-semibold">
                                        <span className="material-symbols-outlined text-sm">check_circle</span> Duyệt
                                    </button>
                                    <button onClick={() => onAction(app, 'reject')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-semibold">
                                        <span className="material-symbols-outlined text-sm">cancel</span> Từ chối
                                    </button>
                                </>
                            )}
                            <button onClick={() => onAction(app, 'delete')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm">delete</span> Xoá
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}
