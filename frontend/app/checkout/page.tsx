"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/axios";
import { useClearCart, useMyCart } from "@/hooks/useCart";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import OrderSummary from "../../components/checkout/OrderSummary";

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const message =
    error.response?.data?.message ||
    error.response?.data?.error?.message ||
    error.message;
  return typeof message === "string" && message.trim() ? message : fallback;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useMyCart();
  const clearCartMutation = useClearCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [pendingOrder, setPendingOrder] = useState<{
    id: string;
    orderNo: string;
    amount: number;
    paymentContent: string;
    status: string;
  } | null>(null);

  const items = cart?.items || [];

  const totalAmount = useMemo(
    () =>
      items.reduce((sum, item) => {
        const qty = item.itemType === "one_time" ? 1 : item.quantity;
        const unitPrice = item.appId?.price || item.priceAtAdd || 0;
        return sum + unitPrice * qty;
      }, 0),
    [items],
  );

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setAppliedCouponCode(null);
    setDiscountAmount(0);
    setCouponMessage(null);
  }, [items.length, totalAmount]);

  const handleApplyCoupon = async () => {
    const code = couponCodeInput.trim().toUpperCase();
    if (!code || isApplyingCoupon || totalAmount <= 0) return;
    setIsApplyingCoupon(true);
    setCouponMessage(null);
    try {
      const response = await api.post("/api/v1/coupons/apply", {
        code,
        price: totalAmount,
      });
      const result = response.data?.data || response.data;
      const discount = Number(result?.discount || 0);
      setAppliedCouponCode(code);
      setDiscountAmount(discount > 0 ? discount : 0);
      setCouponCodeInput(code);
      setCouponMessage("Áp dụng mã giảm giá thành công.");
      showToast("success", "Áp dụng mã giảm giá thành công.");
    } catch (error) {
      const message = getApiErrorMessage(error, "Mã giảm giá không hợp lệ.");
      setAppliedCouponCode(null);
      setDiscountAmount(0);
      setCouponMessage(message);
      showToast("error", message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const orderResponse = await api.post("/api/v1/orders", {
        items: items.map((item) => ({
          app: item.appId?._id,
          name: item.appId?.name || "N/A",
          price: item.appId?.price || item.priceAtAdd || 0.01,
          iconUrl: item.appId?.iconUrl,
        })),
        paymentMethod: "bank_transfer",
        couponCode: appliedCouponCode || undefined,
      });
      const createdOrder = orderResponse.data?.data || orderResponse.data;
      setPendingOrder({
        id: createdOrder.id,
        orderNo: createdOrder.orderNo,
        amount: createdOrder.finalAmount,
        paymentContent: createdOrder.paymentContent || `APK ${createdOrder.orderNo}`,
        status: createdOrder.status || "pending",
      });
      await clearCartMutation.mutateAsync();
      showToast("success", "Đã tạo đơn hàng, vui lòng quét QR để thanh toán.");
    } catch (error) {
      const message = getApiErrorMessage(error, "Đặt hàng thất bại.");
      setApiError(message);
      showToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          {toast.message}
        </div>
      )}
      <Navbar />
      <main className="mt-20 max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="mb-10 pt-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Thanh toán</h1>
          <p className="text-on-surface-variant mt-2 text-lg">
            Hoàn tất các bước dưới đây để mua các ứng dụng của bạn.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
              <h2 className="text-2xl font-bold mb-4">Thanh toán</h2>
              <p className="text-on-surface-variant">
                Chỉ hỗ trợ chuyển khoản ngân hàng (QR). Thông tin khách hàng được lấy tự động từ tài
                khoản đăng nhập qua token.
              </p>
            </div>
          </div>
          <div>
            {pendingOrder ? (
              <PaymentPollingCard
                orderId={pendingOrder.id}
                orderNo={pendingOrder.orderNo}
                amount={pendingOrder.amount}
                paymentContent={pendingOrder.paymentContent}
                status={pendingOrder.status}
                onPaid={() => {
                  showToast("success", "Thanh toán thành công, đang chuyển trang...");
                  router.push("/profile/library");
                }}
              />
            ) : (
              <OrderSummary
                items={items}
                totalAmount={totalAmount}
                discountAmount={discountAmount}
                finalAmount={Math.max(totalAmount - discountAmount, 0)}
                couponCodeInput={couponCodeInput}
                appliedCouponCode={appliedCouponCode}
                isApplyingCoupon={isApplyingCoupon}
                couponMessage={couponMessage}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
                apiError={apiError}
                onCouponCodeInputChange={setCouponCodeInput}
                onApplyCoupon={handleApplyCoupon}
                onPlaceOrder={handlePlaceOrder}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function PaymentPollingCard({
  orderId,
  orderNo,
  amount,
  paymentContent,
  status,
  onPaid,
}: {
  orderId: string;
  orderNo: string;
  amount: number;
  paymentContent: string;
  status: string;
  onPaid: () => void;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [lastTxnId, setLastTxnId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    if (!isPolling) return;
    const timer = window.setInterval(async () => {
      try {
        const response = await api.get(`/api/v1/orders/my/${orderId}`);
        const order = response.data?.data || response.data;
        setCurrentStatus(order.status);
        setLastTxnId(order.paymentId || null);
        if (order.status === "completed") {
          setIsPolling(false);
          onPaid();
        }
      } catch {
        // ignore one-shot polling errors
      }
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPolling, onPaid, orderId]);

  const sepayAcc = process.env.NEXT_PUBLIC_SEPAY_ACC || "0374350170";
  const sepayBank = process.env.NEXT_PUBLIC_SEPAY_BANK || "VPBank";
  const qrUrl = `https://qr.sepay.vn/img?acc=${encodeURIComponent(sepayAcc)}&bank=${encodeURIComponent(sepayBank)}&des=${encodeURIComponent(
    paymentContent,
  )}`;

  return (
    <div className="bg-surface-container-low p-8 rounded-3xl sticky top-24 space-y-4">
      <h3 className="text-xl font-bold">Thanh toán chuyển khoản QR</h3>
      <p className="text-sm text-on-surface-variant">
        Đơn hàng: <span className="font-semibold text-on-surface">{orderNo}</span>
      </p>
      <div className="rounded-2xl border border-outline-variant/30 p-4 bg-white">
        <img src={qrUrl} alt="QR thanh toán ngân hàng" className="w-full rounded-xl" />
      </div>
      <div className="text-sm space-y-2">
        <p>
          Số tiền: <span className="font-semibold">{amount.toLocaleString("vi-VN")} VND</span>
        </p>
        <p>
          Nội dung CK: <span className="font-semibold">{paymentContent}</span>
        </p>
        <p>
          Trạng thái: <span className="font-semibold uppercase">{currentStatus}</span>
        </p>
        {lastTxnId && (
          <p>
            Mã giao dịch: <span className="font-semibold">{lastTxnId}</span>
          </p>
        )}
      </div>
      <p className="text-xs text-on-surface-variant">
        Hệ thống đang long polling mỗi 5 giây, sau khi thanh toán thành công sẽ tự chuyển về thư
        viện ứng dụng của bạn.
      </p>
    </div>
  );
}
