interface CheckoutPaymentMethodProps {
  paymentMethod: "card" | "momo";
  onPaymentMethodChange: (value: "card" | "momo") => void;
}

export default function CheckoutPaymentMethod({
  paymentMethod,
  onPaymentMethodChange,
}: CheckoutPaymentMethodProps) {
  return (
    <section>
      <h3 className="text-xl font-bold mb-4">Phương thức thanh toán</h3>
      <div className="space-y-4">
        <label className="flex items-center gap-4 p-4 border border-outline-variant/30 rounded-xl cursor-pointer hover:bg-surface-container-low">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "card"}
            onChange={() => onPaymentMethodChange("card")}
            className="text-primary w-5 h-5 focus:ring-primary"
          />
          <span className="font-medium">
            Thẻ tín dụng / Ghi nợ (Visa, Mastercard)
          </span>
        </label>
        <label className="flex items-center gap-4 p-4 border border-outline-variant/30 rounded-xl cursor-pointer hover:bg-surface-container-low">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "momo"}
            onChange={() => onPaymentMethodChange("momo")}
            className="text-primary w-5 h-5 focus:ring-primary"
          />
          <span className="font-medium">Ví điện tử (Momo, ZaloPay)</span>
        </label>
      </div>
    </section>
  );
}
