"use client";
import { useState } from "react";
import { User } from "@/store/useAuthStore";

export function SocialLinksForm({ user, onSave, loading }: { user: User, onSave: (data: { socialLinks: Record<string, string> }) => void, loading: boolean }) {
    const defaultLinks = { facebook: "", twitter: "", github: "", linkedin: "", website: "" };
    const [links, setLinks] = useState<Record<string, string>>(user?.socialLinks || defaultLinks);

    const handleChange = (field: string, val: string) => setLinks((p) => ({ ...p, [field]: val }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ socialLinks: links });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Mạng xã hội & Liên kết</h3>
            {['facebook', 'twitter', 'github', 'linkedin', 'website'].map(k => (
                <div key={k} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-500 w-24 capitalize">{k}</span>
                    <input type="text" value={links[k] || ""} onChange={e => handleChange(k, e.target.value)} className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://" />
                </div>
            ))}
            <button disabled={loading} type="submit" className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 text-sm mt-4">Cập nhật liên kết</button>
        </form>
    );
}
