import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import OrderSummary from "../../components/checkout/OrderSummary";
import { mockApps } from "../../components/category/data";

export default function CheckoutPage() {
  const checkoutItems = [mockApps[1], mockApps[3]];
  return (
    <>
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
            <CheckoutForm />
          </div>
          <div>
            <OrderSummary apps={checkoutItems} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
