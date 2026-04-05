"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Coins, User, Settings, LogOut, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function NavProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAuthStore();

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

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/cart"
        className="p-2 hover:bg-slate-100/50 rounded-full transition-colors relative"
      >
        <span className="material-symbols-outlined text-slate-600">
          shopping_cart
        </span>
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant/20 hover:ring-2 hover:ring-blue-500 transition-all relative focus:outline-none"
        >
          <Image
            alt="User profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuATmrxYA52dli6iSqeFTy7F1qW-2DVZkF5AFAI7DrbRvJF6dxFe--SldncN0spBWln2U540bp4_gOJ2CJ93abVKmOfW-8Jo6fJa-GToYMWkHT1dIR01k9oE0dkbpM2zfigQpjfBY17fuZdzEyjgfpIHNPPRASMLkv70OApkI8bWReMHnmNGlJVeSYJMLNBB28duShTpcCa_qmclTgSiIy9bcQgn9chwN5lefFfQlbiXqj6TDEk0SCmISnIXjwZisKLp1IQzp3zYQBE"
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
                    alt="User profile"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuATmrxYA52dli6iSqeFTy7F1qW-2DVZkF5AFAI7DrbRvJF6dxFe--SldncN0spBWln2U540bp4_gOJ2CJ93abVKmOfW-8Jo6fJa-GToYMWkHT1dIR01k9oE0dkbpM2zfigQpjfBY17fuZdzEyjgfpIHNPPRASMLkv70OApkI8bWReMHnmNGlJVeSYJMLNBB28duShTpcCa_qmclTgSiIy9bcQgn9chwN5lefFfQlbiXqj6TDEk0SCmISnIXjwZisKLp1IQzp3zYQBE"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-800 text-sm">
                    Nghia Trung
                  </span>
                  <span
                    className="text-xs text-slate-500 truncate"
                    title="hello@horizon-store.com"
                  >
                    hello@horizon-...
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm font-medium">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-yellow-500" /> Horizon Coin
                </span>
                <span className="text-blue-600 font-bold">5,000</span>
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
              {isAdmin() && (
                <Link
                  href="/admin/categories"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors text-sm font-medium border-t border-slate-100 mt-1 pt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Quản lý Danh mục
                </Link>
              )}
            </div>

            <div className="p-2 border-t border-slate-100">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-slate-700 hover:text-red-600 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
