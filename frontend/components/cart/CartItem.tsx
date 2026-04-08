import { CartItemData, CartAppItem } from "@/hooks/useCart";

type CartItemProps = {
  item: CartItemData;
  onRemove?: (appId: string) => void;
  isRemoving?: boolean;
};

export default function CartItem({ item, onRemove, isRemoving }: CartItemProps) {
  const app = item.appId as CartAppItem;
  const price =
    item.itemType === "subscription"
      ? app?.subscriptionPrice || item.priceAtAdd || 0
      : app?.price || item.priceAtAdd || 0;

  return (
    <div className="flex bg-surface-container-lowest p-4 rounded-xl shadow-sm gap-6 items-center">
      <div className="w-24 h-24 bg-surface-container rounded-lg flex-shrink-0 p-2 overflow-hidden">
        <img
          alt={app?.name || "App"}
          className="w-full h-full object-contain"
          src={app?.iconUrl || "https://i.sstatic.net/l60Hf.png"}
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-lg">{app?.name || "N/A"}</h3>
        <p className="text-sm text-on-surface-variant font-medium">
          {item.itemType === "subscription" ? "Đăng ký" : "Mua một lần"}
        </p>
        <button
          onClick={() => onRemove?.(app?._id)}
          disabled={isRemoving}
          className="text-error text-sm font-semibold mt-2 hover:underline disabled:opacity-50"
        >
          {isRemoving ? "Đang xoá..." : "Xoá"}
        </button>
      </div>
      <div className="text-right">
        <span className="font-bold text-xl">{price === 0 ? "0đ" : `$${price}`}</span>
      </div>
    </div>
  );
}
