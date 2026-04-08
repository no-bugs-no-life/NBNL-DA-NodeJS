"use client";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import Image from "next/image";

function UserProfile() {
  const { user, logout } = useAuthStore();
  const avatar = user?.avatarUrl || "https://i.sstatic.net/l60Hf.png";

  const roleObj = user?.role as unknown as { name?: string };
  const roleName =
    typeof user?.role === "object" ? roleObj.name : user?.role || "ADMIN";

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800 leading-none">
            {user?.fullName || user?.username || "Admin"}
          </p>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1 block">
            {roleName}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-200 relative overflow-hidden">
          <Image src={avatar} alt="Avatar" fill className="object-cover" />
        </div>
      </div>
      <button
        onClick={handleLogout}
        title="Đăng xuất"
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
      </button>
    </div>
  );
}

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-[72px] px-4 md:px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <div className="hidden md:flex items-center w-full max-w-xl">
          <div className="group flex items-center w-full rounded-xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
            <span className="material-symbols-outlined text-slate-400 ml-3 text-[20px] transition-colors group-focus-within:text-blue-500">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm ứng dụng, developer..."
              className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder:text-slate-400 py-2.5 px-2"
            />
            <button
              type="button"
              aria-label="Xóa tìm kiếm"
              className="mr-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Tìm kiếm"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-6 shrink-0 ml-3">
        <Link
          href="/"
          className="hidden sm:flex text-sm text-blue-600 hover:text-blue-700 font-bold items-center gap-1.5 transition-colors bg-blue-50 px-4 py-2 rounded-full"
        >
          Trang chủ Website
          <span className="material-symbols-outlined text-[16px]">
            open_in_new
          </span>
        </Link>
        <Link
          href="/"
          className="sm:hidden w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center"
          aria-label="Trang chủ Website"
        >
          <span className="material-symbols-outlined text-[18px]">
            open_in_new
          </span>
        </Link>
        <div className="w-px h-6 bg-slate-200 hidden sm:block" />
        <UserProfile />
      </div>
    </header>
  );
}
