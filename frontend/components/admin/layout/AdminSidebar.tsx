"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  FolderOpenIcon,
  DevicePhoneMobileIcon,
  TagIcon,
  CodeBracketIcon,
  HeartIcon,
  StarIcon,
  ShoppingCartIcon,
  TicketIcon,
  BanknotesIcon,
  FolderIcon,
  FlagIcon,
  CreditCardIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const MENU_GROUPS = [
  {
    title: "Tổng quan",
    items: [
      { name: "Dashboard", icon: Squares2X2Icon, path: "/admin/dashboard" },
      {
        name: "Quản lý Analytics",
        icon: ChartBarIcon,
        path: "/admin/analytics",
      },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      {
        name: "Quản lý Danh mục",
        icon: FolderOpenIcon,
        path: "/admin/categories",
      },
      { name: "Quản lý App", icon: DevicePhoneMobileIcon, path: "/admin/apps" },
      { name: "Quản lý Đánh giá", icon: StarIcon, path: "/admin/reviews" },
      { name: "Quản lý Tag", icon: TagIcon, path: "/admin/tags" },
      {
        name: "Quản lý Developer",
        icon: CodeBracketIcon,
        path: "/admin/developers",
      },
      { name: "Quản lý Wishlist", icon: HeartIcon, path: "/admin/wishlists" },
      {
        name: "Quản lý Giỏ hàng",
        icon: ShoppingCartIcon,
        path: "/admin/carts",
      },
      { name: "Quản lý Files", icon: FolderIcon, path: "/admin/files" },
      { name: "Quản lý Coupon", icon: TicketIcon, path: "/admin/coupons" },
      {
        name: "Quản lý Subscriptions",
        icon: BanknotesIcon,
        path: "/admin/subscriptions",
      },
      {
        name: "Quản lý Gói Subscription",
        icon: CreditCardIcon,
        path: "/admin/sub-packages",
      },
      { name: "Quản lý Reports", icon: FlagIcon, path: "/admin/reports" },
    ],
  },
];

function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 mb-8 px-4 mt-2">
      <img
        src="/logo.png"
        alt="Logo"
        className="h-8 rounded-lg object-contain bg-slate-100"
      />
      <span className="font-bold text-xl tracking-tight text-slate-800">
        Admin Panel
      </span>
    </div>
  );
}

function SidebarItem({
  menu,
  isActive,
  onClick,
}: {
  menu: { name: string; path: string; icon: React.ElementType };
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = menu.icon;
  return (
    <Link
      href={menu.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold mb-1 transition-all ${
        isActive
          ? "bg-blue-50 text-blue-600 border border-blue-100/50"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-transparent"
      }`}
    >
      <Icon className="w-5 h-5 stroke-[2px]" />
      <span className="text-sm">{menu.name}</span>
    </Link>
  );
}

export function AdminSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}) {
  const pathname = usePathname() || "";

  return (
    <aside
      className={`w-64 border-r border-slate-200 bg-white h-screen shrink-0 overflow-y-auto p-4 flex-col fixed md:sticky top-0 z-50 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] scrollbar-hide transition-transform md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex items-center justify-between md:hidden mb-4">
        <SidebarLogo />
        <button
          onClick={() => setIsOpen?.(false)}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
      <div className="hidden md:block">
        <SidebarLogo />
      </div>

      <nav className="flex flex-col gap-6 mt-4 md:mt-0">
        {MENU_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              {group.title}
            </h3>
            <div className="flex flex-col">
              {group.items.map((m) => (
                <SidebarItem
                  key={m.path}
                  menu={m}
                  isActive={pathname.startsWith(m.path)}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setIsOpen?.(false);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
