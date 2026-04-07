"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import useAuthStore from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export default function NavLinks() {
  const pathname = usePathname();
  const { data: categories = [], isLoading } = useCategories();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const roleName = (user?.role as any)?.name || user?.role || "";
  const isAdmin = roleName === "ADMIN" || roleName === "MODERATOR";

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    return isActive(path)
      ? "text-blue-700 border-b-2 border-blue-700 pb-1"
      : "text-slate-600 hover:text-slate-900 transition-colors pb-1 border-b-2 border-transparent";
  };

  return (
    <div className="hidden md:flex items-center gap-6 text-sm font-medium tracking-tight">
      <Link className={getLinkClasses("/")} href="/">
        Trang chủ
      </Link>
      <Link className={getLinkClasses("/apps")} href="/apps">
        Ứng dụng
      </Link>
      <Link className={getLinkClasses("/games")} href="/games">
        Trò chơi
      </Link>

      {/* Category Mega Menu */}
      <div className="relative group">
        <Link
          className={`${getLinkClasses("/category")} flex items-center gap-1 cursor-pointer`}
          href="/category"
        >
          Danh mục
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </Link>

        {/* Dropdown Content */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="bg-surface-container-lowest shadow-xl rounded-2xl p-6 border border-outline/10 w-[600px] grid grid-cols-2 gap-4">
            {isLoading ? (
              <div className="col-span-2 text-center text-sm py-4">
                Đang tải danh mục...
              </div>
            ) : categories.length > 0 ? (
              categories.map((c) => (
                <Link
                  key={c._id}
                  href={`/category/${c._id}`}
                  className="flex items-center p-3 rounded-xl hover:bg-surface-container-low transition-colors group/item"
                >
                  <span className="font-semibold text-on-surface group-hover/item:text-primary transition-colors">
                    {c.name}
                  </span>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center text-sm py-4 text-on-surface-variant">
                Không có danh mục nào
              </div>
            )}
            <Link
              href="/category"
              className="col-span-2 flex items-center justify-center gap-2 p-3 mt-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors font-semibold text-primary"
            >
              Xem tất cả danh mục
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>

      <Link className={getLinkClasses("/deals")} href="/deals">
        Khuyến mãi
      </Link>

      {mounted && isAuthenticated && isAdmin && (
        <Link
          href="/admin/dashboard"
          className="ml-2 flex items-center gap-1.5 px-4 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-full font-bold transition-all border border-blue-200 hover:border-blue-600 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">
            admin_panel_settings
          </span>
          Quản lý
        </Link>
      )}
    </div>
  );
}
