"use client";
import { AppTable } from "@/components/admin/apps/AppTable";
import { ConfirmAppModal } from "@/components/admin/apps/ConfirmAppModal";
import { useAdminApps } from "./useAdminApps";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

function TopBar({ count, isPendingFilter, setPending }: { count: number, isPendingFilter: boolean, setPending: (b: boolean) => void }) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Quản lý App</h1>
                <p className="text-slate-500 text-sm">Hiển thị {count} ứng dụng</p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
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
            <TopBar count={s.totalDocs} isPendingFilter={s.isPendingFilter} setPending={(p) => { s.setIsPendingFilter(p); s.setPage(1); }} />
            <AppTable
                apps={s.apps}
                isLoading={s.isLoading}
                onAction={(app, action) => s.setActionTarget({ app, action })}
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
        </>
    );
}
