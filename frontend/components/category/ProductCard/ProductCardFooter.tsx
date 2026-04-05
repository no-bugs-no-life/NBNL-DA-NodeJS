export default function ProductCardFooter({
  price,
  action,
}: {
  price: string;
  action: string;
}) {
  return (
    <div className="flex items-center justify-between mt-auto pt-2">
      <span className="text-sm font-bold text-on-surface">{price}</span>
      <button className="px-4 py-1.5 bg-surface-container-high rounded-full text-xs font-bold hover:bg-primary hover:text-white transition-all">
        {action}
      </button>
    </div>
  );
}
