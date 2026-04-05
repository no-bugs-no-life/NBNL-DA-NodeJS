"use client";
import { AppTable } from "@/components/admin/apps/AppTable";
import { ConfirmAppModal } from "@/components/admin/apps/ConfirmAppModal";
import { AppFormModal } from "@/components/admin/apps/AppFormModal";
import { useAdminApps } from "./useAdminApps";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

function TopBar({ count, isPendingFilter, setPending, onAddClick }: { count: number, isPendingFilter: boolean, setPending: (b: boolean) => void, onAddClick: () => void }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Quản lý App</h1>
                <p className="text-slate-500 text-sm">Hiển thị {count} ứng dụng</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                    <button
                        onClick={() => setPending(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${!isPendingFilter ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Đã phát hành
                    </button>
                    <button
                        onClick={() => setPending(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isPendingFilter ? 'bg-amber-50 text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Chờ duyệt
                    </button>
                </div>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-sm">add</span> Thêm mới
                </button>
            </div>
        </div>
    );
}

function ToastAlert({ toast }: { toast: { message: string, type: string } | null }) {
    if (!toast) return null;
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            <span className="material-symbols-outlined">{toast.type === "success" ? "check_circle" : "error"}</span> {toast.message}
        </div>
    );
}

export default function AdminAppsPage() {
    const { checkAuth } = useAuthStore();
    const s = useAdminApps();

    useEffect(() => { checkAuth(); }, [checkAuth]);

    if (!s.isAuthLoading && !s.isAdmin()) {
        notFound();
    }

    if (s.isAuthLoading) return null;

    return (
        <>
            <TopBar
                count={s.totalDocs}
                isPendingFilter={s.isPendingFilter}
                setPending={(p) => { s.setIsPendingFilter(p); s.setPage(1); }}
                onAddClick={() => s.setFormTarget({ action: 'create' })}
            />
            <AppTable
                apps={s.apps}
                isLoading={s.isLoading}
                onAction={(app, action) => {
                    if (action === 'edit') s.setFormTarget({ app, action });
                    else s.setActionTarget({ app, action });
                }}
                page={s.page}
                totalPages={s.totalPages}
                onPageChange={s.setPage}
            />
            <ToastAlert toast={s.toast} />

            {s.actionTarget && (
                <ConfirmAppModal
                    app={s.actionTarget.app}
                    action={s.actionTarget.action}
                    onClose={() => s.setActionTarget(null)}
                    onConfirm={() => {
                        if (s.actionTarget?.action === 'approve') s.mApprove.mutate(s.actionTarget.app._id);
                        if (s.actionTarget?.action === 'reject') s.mReject.mutate(s.actionTarget.app._id);
                        if (s.actionTarget?.action === 'delete') s.mDelete.mutate(s.actionTarget.app._id);
                    }}
                    loading={s.mApprove.isPending || s.mReject.isPending || s.mDelete.isPending}
                />
            )}

            {s.formTarget && (
                <AppFormModal
                    app={s.formTarget.app}
                    action={s.formTarget.action}
                    onClose={() => s.setFormTarget(null)}
                    onSubmit={(data) => {
                        if (s.formTarget?.action === 'create') s.mCreate.mutate(data);
                        else if (s.formTarget?.action === 'edit' && s.formTarget.app) s.mUpdate.mutate({ id: s.formTarget.app._id, data });
                    }}
                    loading={s.mCreate.isPending || s.mUpdate.isPending}
                />
            )}
        </>
    );
}
