"use client";

import { useRemoveFromCart, useMyCart, CartItemData } from "@/hooks/useCart";
import CartItem from "./CartItem";

export default function CartItemList({ items }: { items?: CartItemData[] }) {
  const { data: cart, isLoading } = useMyCart();
  const removeMutation = useRemoveFromCart();

  const sourceItems = items ?? cart?.items ?? [];

  const handleRemove = async (appId: string) => {
    if (!appId) return;
    try {
      await removeMutation.mutateAsync(appId);
    } catch {
      // silent
    }
  };

  if (isLoading && sourceItems.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 bg-surface-container-low rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (sourceItems.length === 0) {
    return (
      <div className="text-center py-16 text-on-surface-variant bg-surface-container-low rounded-xl">
        Giỏ hàng trống
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sourceItems.map((item) => (
        <CartItem
          key={item._id}
          item={item}
          onRemove={handleRemove}
          isRemoving={removeMutation.isPending && removeMutation.variables === item.appId?._id}
        />
      ))}
    </div>
  );
}
