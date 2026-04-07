"use client";

import { useMemo } from "react";
import { useMyCart } from "@/hooks/useCart";

export default function CartSummary() {
  const { data: cart, isLoading } = useMyCart();

  const items = cart?.items || [];

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price =
        item.itemType === "subscription"
          ? item.appId?.subscriptionPrice || item.priceAtAdd || 0
          : item.appId?.price || item.priceAtAdd || 0;
      return sum + price * (item.quantity || 1);
    }, 0);
  }, [items]);

  return (
    <div className="bg-surface-container-low p-8 rounded-3xl sticky top-24">
      <h3 className="text-2xl font-bold mb-6">Tóm tắt đơn hàng</h3>
      <div className="space-y-4 mb-6 border-b border-outline-variant/20 pb-6">
        <div className="flex justify-between text-on-surface-variant">
          <span>Tạm tính ({items.length} sản phẩm)</span>
          <span className="font-medium text-on-surface">
            {isLoading ? "..." : `$${subtotal.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-on-surface-variant">
          <span>Khuyến mãi</span>
          <span className="font-medium text-error">-0đ</span>
        </div>
      </div>
      <div className="flex justify-between font-bold text-xl mb-8">
        <span>Tổng cộng</span>
        <span className="text-primary">{isLoading ? "..." : `$${subtotal.toFixed(2)}`}</span>
      </div>
      <a
        href="/checkout"
        className="block w-full text-center bg-primary text-on-primary py-4 rounded-xl font-bold hover:brightness-110 transition-all"
      >
        Tiến hành thanh toán
      </a>
      <p className="text-xs text-on-surface-variant mt-4 text-center">
        Bằng việc thanh toán, bạn đồng ý với Điều khoản dịch vụ của APKBugs
        Store.
      </p>
    </div>
  );
}
