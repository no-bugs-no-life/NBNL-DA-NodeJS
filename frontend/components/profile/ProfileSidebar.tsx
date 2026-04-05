"use client";

import {
  LayoutGrid,
  Heart,
  Settings,
  History,
  Shield,
  LogOut,
} from "lucide-react";
import { useState } from "react";

export default function ProfileSidebar() {
  const [activeTab, setActiveTab] = useState("library");

  const menuItems = [
    { id: "library", label: "Thư viện của tôi", icon: LayoutGrid },
    { id: "wishlist", label: "Danh sách Ước", icon: Heart },
    { id: "history", label: "Lịch sử mua hàng", icon: History },
    { id: "settings", label: "Khoá bảo mật", icon: Shield },
    { id: "account", label: "Cài đặt tài khoản", icon: Settings },
  ];

  return (
    <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-4 mt-auto">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
