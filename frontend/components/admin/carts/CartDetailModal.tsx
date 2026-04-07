"use client";
import { CartItem } from "@/hooks/useCart";
interface Props {
  cart: CartItem;
  onClose: () => void;
  onRemoveItem: (appId: string) => void;
  removingAppId?: string;
}
export function CartDetailModal({
  cart,
  onClose,
  onRemoveItem,
  removingAppId,
}: Props) {
  const items = cart.items || [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <ModalHeader cart={cart} onClose={onClose} />
        <div className="p-6 overflow-y-auto flex-1">
          {items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemCard
                  key={item._id}
                  item={item}
                  isRemoving={removingAppId === (item.appId as any)?._id}
                  onRemove={() => onRemoveItem((item.appId as any)?._id)}
                />
              ))}
            </div>
          )}
        </div>
        <ModalFooter cart={cart} onClose={onClose} />
      </div>
    </div>
  );
}
function ModalHeader({
  cart,
  onClose,
}: {
  cart: CartItem;
  onClose: () => void;
}) {
  const user = cart.user;
  return (
    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Chi tiết Giỏ hàng
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {user?.fullName} · {user?.email}
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  );
}
function EmptyState() {
  return (
    <div className="text-center py-12">
      <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">
        shopping_cart
      </span>
      <p className="text-slate-500 text-sm">Giỏ hàng trống</p>
    </div>
  );
}
function ModalFooter({
  cart,
  onClose,
}: {
  cart: CartItem;
  onClose: () => void;
}) {
  return (
    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
      <div className="text-sm">
        <span className="text-slate-500">
          {cart.items?.length || 0} items
        </span>
        <span className="mx-2 text-slate-300">·</span>
        <span className="font-bold text-slate-800">
          ${cart.totalPrice?.toFixed(2) || "0.00"}
        </span>
      </div>
      <button
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
      >
        Đóng
      </button>
    </div>
  );
}
function CartItemCard({
  item,
  isRemoving,
  onRemove,
}: {
  item: CartItem["items"][0];
  isRemoving: boolean;
  onRemove: () => void;
}) {
  const app = item.appId as any;
  const price =
    item.itemType === "subscription" ? app?.subscriptionPrice : app?.price;
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
        <img
          src={app?.iconUrl || "https://i.sstatic.net/l60Hf.png"}
          alt={app?.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm truncate">
          {app?.name || "N/A"}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
            {item.itemType === "subscription"
              ? `Subscription · ${item.plan}`
              : "One-time"}
          </span>
          {item.quantity > 1 && (
            <span className="text-[10px] text-slate-400">x{item.quantity}</span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="font-bold text-slate-800 text-sm">${price || 0}</p>
      </div>
      <button
        onClick={onRemove}
        disabled={isRemoving}
        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-all disabled:opacity-50"
      >
        {isRemoving ? (
          <span className="material-symbols-outlined text-sm animate-spin">
            progress_activity
          </span>
        ) : (
          <span className="material-symbols-outlined text-sm">delete</span>
        )}
      </button>
    </div>
  );
}
