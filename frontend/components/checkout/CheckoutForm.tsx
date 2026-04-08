import CheckoutCustomerInfo from "./CheckoutCustomerInfo";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";

interface CheckoutFormProps {
  fullName: string;
  email: string;
  paymentMethod: "card" | "momo";
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPaymentMethodChange: (value: "card" | "momo") => void;
}

export default function CheckoutForm({
  fullName,
  email,
  paymentMethod,
  onFullNameChange,
  onEmailChange,
  onPaymentMethodChange,
}: CheckoutFormProps) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
      <h2 className="text-2xl font-bold mb-8">Chi tiết thanh toán</h2>
      <form>
        <CheckoutCustomerInfo
          fullName={fullName}
          email={email}
          onFullNameChange={onFullNameChange}
          onEmailChange={onEmailChange}
        />
        <CheckoutPaymentMethod
          paymentMethod={paymentMethod}
          onPaymentMethodChange={onPaymentMethodChange}
        />
      </form>
    </div>
  );
}
