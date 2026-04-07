import type { CartItemData } from "@/hooks/useCart";

interface OrderSummaryProps {
  items: CartItemData[];
  totalAmount: number;
  isLoading: boolean;
  isSubmitting: boolean;
  apiError: string | null;
  onPlaceOrder: () => void;
}

function toPriceText(price: number) {
  return price <= 0 ? "0đ" : `$${price.toFixed(2)}`;
}

export default function OrderSummary({
  items,
  totalAmount,
  isLoading,
  isSubmitting,
  apiError,
  onPlaceOrder,
}: OrderSummaryProps) {
  return (
    <div className="bg-surface-container-low p-8 rounded-3xl sticky top-24">
      <h3 className="text-xl font-bold mb-6">Đơn hàng của bạn</h3>
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 items-center border-b border-outline-variant/20 pb-4"
          >
            <img
              alt={item.appId?.name || ""}
              src={item.appId?.iconUrl || ""}
              className="w-12 h-12 rounded object-cover bg-white"
            />
            <div className="flex-1">
              <h4 className="font-bold text-sm truncate">{item.appId?.name || "N/A"}</h4>
              <p className="text-xs text-on-surface-variant font-medium">
                {item.itemType === "subscription" ? "Subscription" : "Mua một lần"} x{" "}
                {item.quantity}
              </p>
            </div>
            <span className="font-bold text-sm text-right">
              {toPriceText(item.priceAtAdd * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between font-bold text-xl mb-8">
        <span>Tổng cộng</span>
        <span className="text-primary">
          {isLoading ? "..." : toPriceText(totalAmount)}
        </span>
      </div>
      <button
        type="button"
        disabled={isSubmitting || items.length === 0}
        onClick={onPlaceOrder}
        className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
      </button>
      {items.length === 0 && (
        <p className="mt-3 text-sm text-on-surface-variant text-center">
          Giỏ hàng đang trống, vui lòng thêm sản phẩm trước khi thanh toán.
        </p>
      )}
      {apiError && <p className="mt-3 text-sm text-error">{apiError}</p>}
    </div>
  );
}
