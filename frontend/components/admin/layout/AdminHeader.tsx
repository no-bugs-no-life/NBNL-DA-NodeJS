"use client";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import Image from "next/image";

function UserProfile() {
    const { user } = useAuthStore();
    const avatar = user?.avatarUrl || "https://i.sstatic.net/l60Hf.png";

    const roleObj = user?.role as unknown as { name?: string };
    const roleName = typeof user?.role === "object" ? roleObj.name : user?.role || "ADMIN";

    return (
        <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">{user?.fullName || user?.username || "Admin"}</p>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1 block">{roleName}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-200 relative overflow-hidden">
                <Image src={avatar} alt="Avatar" fill className="object-cover" />
            </div>
        </div>
    );
}

export function AdminHeader() {
    return (
        <header className="h-[72px] px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">search</span>
                <input type="text" placeholder="Tìm kiếm..." className="bg-transparent border-none focus:outline-none text-sm w-48 text-slate-700" />
            </div>
            <div className="flex items-center gap-6">
                <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1.5 transition-colors bg-blue-50 px-4 py-2 rounded-full">
                    Trang chủ Website <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
                <div className="w-px h-6 bg-slate-200" />
                <UserProfile />
            </div>
        </header>
    );
}
