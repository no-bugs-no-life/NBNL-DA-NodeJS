import type { CartItemData } from "@/hooks/useCart";

interface OrderSummaryProps {
  items: CartItemData[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCodeInput: string;
  appliedCouponCode: string | null;
  isApplyingCoupon: boolean;
  couponMessage: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  apiError: string | null;
  onCouponCodeInputChange: (value: string) => void;
  onApplyCoupon: () => void;
  onPlaceOrder: () => void;
}

function toPriceText(price: number) {
  return price <= 0 ? "0đ" : `${price.toLocaleString("vi-VN")}đ`;
}

export default function OrderSummary({
  items,
  totalAmount,
  discountAmount,
  finalAmount,
  couponCodeInput,
  appliedCouponCode,
  isApplyingCoupon,
  couponMessage,
  isLoading,
  isSubmitting,
  apiError,
  onCouponCodeInputChange,
  onApplyCoupon,
  onPlaceOrder,
}: OrderSummaryProps) {
  return (
    <div className="bg-surface-container-low p-8 rounded-3xl sticky top-24">
      <h3 className="text-xl font-bold mb-6">Đơn hàng của bạn</h3>
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          (() => {
            const qty = item.itemType === "one_time" ? 1 : item.quantity;
            const unitPrice = item.appId?.price || item.priceAtAdd || 0;
            return (
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
                {qty}
              </p>
            </div>
            <span className="font-bold text-sm text-right">
              {toPriceText(unitPrice * qty)}
            </span>
          </div>
            );
          })()
        ))}
      </div>
      <div className="flex justify-between font-bold text-xl mb-8">
        <span>Tổng cộng</span>
        <span className="text-primary">
          {isLoading ? "..." : toPriceText(totalAmount)}
        </span>
      </div>
      <div className="mb-6 space-y-3">
        <label htmlFor="coupon-code" className="text-sm font-medium">
          Mã giảm giá
        </label>
        <div className="flex gap-2">
          <input
            id="coupon-code"
            type="text"
            value={couponCodeInput}
            onChange={(e) => onCouponCodeInputChange(e.target.value)}
            placeholder="Nhập mã coupon"
            className="flex-1 rounded-xl border border-outline-variant/30 px-3 py-2 text-sm bg-white"
          />
          <button
            type="button"
            onClick={onApplyCoupon}
            disabled={isApplyingCoupon || !couponCodeInput.trim() || items.length === 0}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isApplyingCoupon ? "Đang áp dụng..." : "Áp dụng"}
          </button>
        </div>
        {couponMessage && (
          <p
            className={`text-sm ${
              appliedCouponCode ? "text-green-600" : "text-error"
            }`}
          >
            {couponMessage}
          </p>
        )}
      </div>
      {discountAmount > 0 && (
        <div className="flex justify-between text-sm mb-2 text-green-700">
          <span>Giảm giá ({appliedCouponCode})</span>
          <span>-{toPriceText(discountAmount)}</span>
        </div>
      )}
      <div className="flex justify-between font-bold text-lg mb-8">
        <span>Cần thanh toán</span>
        <span className="text-primary">{isLoading ? "..." : toPriceText(finalAmount)}</span>
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
