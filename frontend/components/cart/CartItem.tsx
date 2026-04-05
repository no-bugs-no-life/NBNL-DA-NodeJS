import { AppItem } from "../category/types";

export default function CartItem({ app }: { app: AppItem }) {
  return (
    <div className="flex bg-surface-container-lowest p-4 rounded-xl shadow-sm gap-6 items-center">
      <div className="w-24 h-24 bg-surface-container rounded-lg flex-shrink-0 p-2 overflow-hidden">
        <img
          alt={app.title}
          className="w-full h-full object-contain"
          src={app.iconSrc}
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-lg">{app.title}</h3>
        <p className="text-sm text-on-surface-variant font-medium">
          {app.company}
        </p>
        <button className="text-error text-sm font-semibold mt-2 hover:underline">
          Xoá
        </button>
      </div>
      <div className="text-right">
        <span className="font-bold text-xl">
          {app.price === "Miễn phí" ? "0đ" : app.price}
        </span>
      </div>
    </div>
  );
}
