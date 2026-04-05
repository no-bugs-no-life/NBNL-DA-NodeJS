import { AppItem } from "../category/types";

export default function OrderSummary({ apps }: { apps: AppItem[] }) {
  return (
    <div className="bg-surface-container-low p-8 rounded-3xl sticky top-24">
      <h3 className="text-xl font-bold mb-6">Đơn hàng của bạn</h3>
      <div className="space-y-4 mb-6">
        {apps.map((app) => (
          <div
            key={app.id}
            className="flex gap-4 items-center border-b border-outline-variant/20 pb-4"
          >
            <img
              alt={app.title}
              src={app.iconSrc}
              className="w-12 h-12 rounded object-cover bg-white"
            />
            <div className="flex-1">
              <h4 className="font-bold text-sm truncate">{app.title}</h4>
              <p className="text-xs text-on-surface-variant font-medium">
                {app.company}
              </p>
            </div>
            <span className="font-bold text-sm text-right">
              {app.price === "Miễn phí" ? "0đ" : app.price}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between font-bold text-xl mb-8">
        <span>Tổng cộng</span>
        <span className="text-primary">370.000đ</span>
      </div>
      <button className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:brightness-110 transition-all">
        Đặt hàng
      </button>
    </div>
  );
}
