"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Heart,
  Settings,
  History,
  Shield,
  LogOut,
} from "lucide-react";
import useAuthStore, { apiClient } from "@/store/useAuthStore";

export default function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/v1/auth/logout");
    } catch {
      // silent fail
    } finally {
      logout();
      router.push("/login");
    }
  };

  const menuItems = [
    { id: "/profile/library", label: "Thư viện của tôi", icon: LayoutGrid },
    { id: "/profile/wishlist", label: "Danh sách Ước", icon: Heart },
    { id: "/profile/history", label: "Lịch sử mua hàng", icon: History },
    { id: "/profile/security", label: "Khoá bảo mật", icon: Shield },
    { id: "/profile/settings", label: "Cài đặt tài khoản", icon: Settings },
  ];

  return (
    <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.id ||
            (pathname === "/profile" && item.id === "/profile/library");

          return (
            <Link
              key={item.id}
              href={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-600" : ""}`}
              />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
