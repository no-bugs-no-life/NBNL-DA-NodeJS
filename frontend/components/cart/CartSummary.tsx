export default function CartSummary() {
  return (
    <div className="bg-surface-container-low p-8 rounded-3xl sticky top-24">
      <h3 className="text-2xl font-bold mb-6">Tóm tắt đơn hàng</h3>
      <div className="space-y-4 mb-6 border-b border-outline-variant/20 pb-6">
        <div className="flex justify-between text-on-surface-variant">
          <span>Tạm tính (2 sản phẩm)</span>
          <span className="font-medium text-on-surface">370.000đ</span>
        </div>
        <div className="flex justify-between text-on-surface-variant">
          <span>Khuyến mãi</span>
          <span className="font-medium text-error">-0đ</span>
        </div>
      </div>
      <div className="flex justify-between font-bold text-xl mb-8">
        <span>Tổng cộng</span>
        <span className="text-primary">370.000đ</span>
      </div>
      <a
        href="/checkout"
        className="block w-full text-center bg-primary text-on-primary py-4 rounded-xl font-bold hover:brightness-110 transition-all"
      >
        Tiến hành thanh toán
      </a>
      <p className="text-xs text-on-surface-variant mt-4 text-center">
        Bằng việc thanh toán, bạn đồng ý với Điều khoản dịch vụ của Horizon
        Store.
      </p>
    </div>
  );
}
