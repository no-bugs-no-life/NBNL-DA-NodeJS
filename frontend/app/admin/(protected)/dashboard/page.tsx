"use client";
import useAuthStore from "@/store/useAuthStore";
import { notFound } from "next/navigation";
import { useEffect } from "react";

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        <span className="material-symbols-outlined text-[28px]">{icon}</span>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-semibold tracking-wide mb-1">
          {title}
        </p>
        <p className="text-3xl font-black text-slate-800 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Người dùng"
        value="1,245"
        icon="group"
        color="bg-blue-50 text-blue-600"
      />
      <StatCard
        title="Ứng dụng"
        value="842"
        icon="apps"
        color="bg-emerald-50 text-emerald-600"
      />
      <StatCard
        title="Doanh thu"
        value="$4,521"
        icon="payments"
        color="bg-amber-50 text-amber-600"
      />
      <StatCard
        title="Lượt tải"
        value="12.5K"
        icon="download"
        color="bg-purple-50 text-purple-600"
      />
    </div>
  );
}

function ChartPlaceholder() {
  return (
    <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] min-h-[400px] flex flex-col">
      <h2 className="text-lg font-extrabold text-slate-800 mb-6">
        Biểu đồ tổng quan
      </h2>
      <div className="flex-1 w-full bg-slate-50/50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
            bar_chart
          </span>
          <p className="text-slate-400 font-medium text-sm">
            Dữ liệu biểu đồ sẽ hiển thị ở đây
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isAdmin, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isLoading && !isAdmin()) {
    notFound();
  }

  if (isLoading) return null;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Tổng quan Hệ thống
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Báo cáo hiệu suất, quản lý người dùng và doanh thu.
        </p>
      </div>
      <DashboardGrid />
      <ChartPlaceholder />
    </>
  );
}
