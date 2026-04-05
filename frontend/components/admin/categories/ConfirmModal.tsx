"use client";

interface ConfirmProps {
    name: string;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export function ConfirmModal({ name, onClose, onConfirm, loading }: ConfirmProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
                <div className="flex flex-col items-center text-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-red-500">delete</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Xác nhận xoá</h2>
                    <p className="text-sm text-slate-500">
                        Bạn có chắc muốn xoá <span className="font-semibold text-slate-700">&quot;{name}&quot;</span>? Hành động không thể hoàn tác.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
                        Huỷ
                    </button>
                    <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
                        {loading ? "Đang xoá..." : "Xoá"}
                    </button>
                </div>
            </div>
        </div>
    );
}
