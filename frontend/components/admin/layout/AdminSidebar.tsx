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
      { name: "Bảng điều khiển", icon: Squares2X2Icon, path: "/admin/dashboard" },
      {
        name: "Quản lý Phân tích",
        icon: ChartBarIcon,
        path: "/admin/analytics",
      },
    ],
  },
  {
    title: "Nội dung hệ thống",
    items: [
      {
        name: "Quản lý Danh mục",
        icon: FolderOpenIcon,
        path: "/admin/categories",
      },
      { name: "Quản lý Ứng dụng", icon: DevicePhoneMobileIcon, path: "/admin/apps" },
      {
        name: "Quản lý Phiên bản (theo Ứng dụng)",
        icon: FolderIcon,
        path: "/admin/apps",
      },
      { name: "Quản lý Đánh giá", icon: StarIcon, path: "/admin/reviews" },
      { name: "Quản lý Thẻ", icon: TagIcon, path: "/admin/tags" },
      { name: "Quản lý Tệp", icon: FolderIcon, path: "/admin/files" },
    ],
  },
  {
    title: "Đối tác & người dùng",
    items: [
      {
        name: "Quản lý Nhà phát triển",
        icon: CodeBracketIcon,
        path: "/admin/developers",
      },
      { name: "Quản lý Yêu thích", icon: HeartIcon, path: "/admin/wishlists" },
      {
        name: "Quản lý Giỏ hàng",
        icon: ShoppingCartIcon,
        path: "/admin/carts",
      },
    ],
  },
  {
    title: "Thương mại & thanh toán",
    items: [
      { name: "Quản lý Mã giảm giá", icon: TicketIcon, path: "/admin/coupons" },
      {
        name: "Quản lý Đăng ký",
        icon: BanknotesIcon,
        path: "/admin/subscriptions",
      },
      {
        name: "Quản lý Gói đăng ký",
        icon: CreditCardIcon,
        path: "/admin/sub-packages",
      },
    ],
  },
  {
    title: "Giám sát hệ thống",
    items: [
      { name: "Quản lý Reports", icon: FlagIcon, path: "/admin/reports" },
    ],
  },
];

function getSelectedAppIdFromPathname(pathname: string) {
  const match = pathname.match(/^\/admin\/apps\/([^/]+)(?:\/|$)/);
  return match?.[1] || null;
}

function buildMenuGroups(pathname: string) {
  const selectedAppId = getSelectedAppIdFromPathname(pathname);
  return MENU_GROUPS.map((group) => {
    if (group.title !== "Nội dung hệ thống") return group;
    return {
      ...group,
      items: group.items
        .map((item) => {
          if (item.name !== "Quản lý Phiên bản (theo Ứng dụng)") return item;
          if (!selectedAppId) return null;
          return {
            ...item,
            path: `/admin/apps/${selectedAppId}#versions`,
          };
        })
        .filter(Boolean) as typeof group.items,
    };
  });
}

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
  const menuGroups = buildMenuGroups(pathname);

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
        {menuGroups.map((group) => (
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
