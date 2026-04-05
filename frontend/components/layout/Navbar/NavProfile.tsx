"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Coins, User, Settings, LogOut, LogIn } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function NavProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
      <Link
        href="/cart"
        className="p-1.5 sm:p-2 hover:bg-slate-100/50 rounded-full transition-colors relative shrink-0"
      >
        <span className="material-symbols-outlined text-slate-600">
          shopping_cart
        </span>
      </Link>

      {!isLoading && !isAuthenticated && (
        <Link
          href="/login"
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-full transition-colors shrink-0 whitespace-nowrap"
        >
          <LogIn className="w-4 h-4" />
          <span>Đăng nhập</span>
        </Link>
      )}

      {isAuthenticated && user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="h-9 w-9 rounded-full overflow-hidden border-2 border-slate-200 hover:border-blue-500 transition-all relative focus:outline-none shrink-0"
          >
            <Image
              alt={user.fullName || user.username}
              src={user.avatarUrl || "https://i.sstatic.net/l60Hf.png"}
              fill
              className="object-cover"
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 relative">
                    <Image
                      alt={user.fullName || user.username}
                      src={user.avatarUrl || "https://i.sstatic.net/l60Hf.png"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 text-sm truncate max-w-[140px]">
                      {user.fullName || user.username}
                    </span>
                    <span
                      className="text-xs text-slate-500 truncate max-w-[140px]"
                      title={user.email}
                    >
                      {user.email}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm font-medium">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-yellow-500" /> APKBugs Coin
                  </span>
                  <span className="text-blue-600 font-bold">{user.coin ? user.coin.toLocaleString() : 0}</span>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  Hồ sơ của tôi
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Cài đặt tài khoản
                </Link>
              </div>

              <div className="p-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-slate-700 hover:text-red-600 transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
