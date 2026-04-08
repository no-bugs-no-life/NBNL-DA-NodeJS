"use client";

import { History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { API_URL } from "@/configs/api";

type OrderItem = {
  app: string;
  name: string;
  price: number;
  iconUrl?: string;
};

type Order = {
  id?: string;
  _id?: string;
  status: string;
  paymentMethod: string;
  finalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

export default function HistoryPage() {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["profile", "orders", "history"],
    queryFn: async () => {
      const res = await api.get("/api/v1/orders/my");
      const raw = res.data?.data || res.data;
      return Array.isArray(raw) ? raw : [];
    },
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const normalizeIcon = (iconUrl?: string) => {
    if (!iconUrl) return "";
    if (
      iconUrl.startsWith("http") ||
      iconUrl.startsWith("blob:") ||
      iconUrl.startsWith("data:")
    ) {
      return iconUrl;
    }
    return `${API_URL}/${iconUrl.replace(/\\/g, "/")}`;
  };

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <div className="text-slate-500 text-sm">Đang tải lịch sử mua hàng...</div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
            <History className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Lịch sử Mua hàng
          </h2>
          <p className="text-slate-500 text-sm">
            Ghi nhận các giao dịch và hoá đơn đã thanh toán trên APKBugs của bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Lịch sử Mua hàng</h2>
        <p className="text-slate-500 text-sm">
          Ghi nhận các giao dịch và hoá đơn đã thanh toán trên APKBugs của bạn.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id || order._id}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  Mã đơn: #{(order.id || order._id || "").slice(-8).toUpperCase()}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  {order.paymentMethod}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={`${item.app}-${idx}`} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    {item.iconUrl ? (
                      <img
                        src={normalizeIcon(item.iconUrl)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-800 truncate">
                      {item.name}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-700">
                    {formatCurrency(item.price)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500">Tổng thanh toán</span>
              <span className="text-base font-bold text-slate-900">
                {formatCurrency(order.finalAmount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
