import { AppItem } from "../category/types";
import CartItem from "./CartItem";

export default function CartItemList({ apps }: { apps: AppItem[] }) {
  return (
    <div className="space-y-4">
      {apps.map((app) => (
        <CartItem key={app.id} app={app} />
      ))}
    </div>
  );
}
