import { AppItem } from "../types";
import ProductCardHeader from "./ProductCardHeader";
import ProductCardFooter from "./ProductCardFooter";

export default function ProductCard({ app }: { app: AppItem }) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-outline-variant/10 flex flex-col h-full">
      <ProductCardHeader app={app} />
      <ProductCardFooter price={app.price} action={app.action} />
    </div>
  );
}
