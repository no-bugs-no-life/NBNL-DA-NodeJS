import CheckoutCustomerInfo from "./CheckoutCustomerInfo";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";

export default function CheckoutForm() {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
      <h2 className="text-2xl font-bold mb-8">Chi tiết thanh toán</h2>
      <form>
        <CheckoutCustomerInfo />
        <CheckoutPaymentMethod />
      </form>
    </div>
  );
}
