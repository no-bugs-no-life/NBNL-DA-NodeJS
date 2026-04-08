interface CheckoutCustomerInfoProps {
  fullName: string;
  email: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export default function CheckoutCustomerInfo({
  fullName,
  email,
  onFullNameChange,
  onEmailChange,
}: CheckoutCustomerInfoProps) {
  return (
    <section className="mb-10">
      <h3 className="text-xl font-bold mb-4">Thông tin khách hàng</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">
            Họ và tên
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/40"
            placeholder="VD: Nguyễn Văn A"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/40"
            placeholder="email@example.com"
          />
        </div>
      </div>
    </section>
  );
}
