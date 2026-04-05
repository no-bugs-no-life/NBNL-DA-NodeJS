"use client";
import { useState } from "react";

interface ModalProps {
    title: string;
    onClose: () => void;
    onSubmit: (name: string, iconUrl: string) => void;
    initialName?: string;
    initialIconUrl?: string;
    loading?: boolean;
}

export function CategoryModal({ title, onClose, onSubmit, initialName = "", initialIconUrl = "", loading }: ModalProps) {
    const [name, setName] = useState(initialName);
    const [iconUrl, setIconUrl] = useState(initialIconUrl);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên danh mục <span className="text-red-500">*</span></label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Icon URL <span className="text-slate-400 font-normal">(tuỳ chọn)</span></label>
                        <input type="text" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Huỷ</button>
                    <button disabled={!name.trim() || loading} onClick={() => onSubmit(name.trim(), iconUrl.trim())} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {loading ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    );
}
