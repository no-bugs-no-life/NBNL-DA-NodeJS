import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import CartItemList from "../../components/cart/CartItemList";
import CartSummary from "../../components/cart/CartSummary";
import { mockApps } from "../../components/category/data";

export default function CartPage() {
  const cartItems = [mockApps[1], mockApps[3]]; // Just taking 2 mock items
  return (
    <>
      <Navbar />
      <main className="mt-20 max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="mb-10 pt-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Giỏ hàng của bạn
          </h1>
          <p className="text-on-surface-variant mt-2 text-lg">
            Xác nhận các ứng dụng bạn muốn mua trước khi thanh toán.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <CartItemList apps={cartItems} />
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
