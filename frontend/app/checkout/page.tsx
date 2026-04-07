"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import api from "@/lib/axios";
import { useClearCart, useMyCart } from "@/hooks/useCart";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import CheckoutForm from "../../components/checkout/CheckoutForm";
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
  const { data: cart, isLoading } = useMyCart();
  const clearCartMutation = useClearCart();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "momo">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const items = cart?.items || [];

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0),
    [items],
  );

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3000);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0 || isSubmitting) return;
    if (!fullName.trim()) {
      const message = "Vui lòng nhập họ và tên.";
      setApiError(message);
      showToast("error", message);
      return;
    }
    if (!email.trim()) {
      const message = "Vui lòng nhập email.";
      setApiError(message);
      showToast("error", message);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      await api.post("/api/v1/orders", {
        items: items.map((item) => ({
          app: item.appId?._id,
          name: item.appId?.name || "N/A",
          price: item.priceAtAdd,
          iconUrl: item.appId?.iconUrl,
        })),
        paymentMethod,
      });
      await clearCartMutation.mutateAsync();
      showToast("success", "Đặt hàng thành công.");
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
            <CheckoutForm
              fullName={fullName}
              email={email}
              paymentMethod={paymentMethod}
              onFullNameChange={setFullName}
              onEmailChange={setEmail}
              onPaymentMethodChange={setPaymentMethod}
            />
          </div>
          <div>
            <OrderSummary
              items={items}
              totalAmount={totalAmount}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              apiError={apiError}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
