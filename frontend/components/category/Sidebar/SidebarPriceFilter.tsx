export function SidebarPriceFilter() {
  const prices = ["Tất cả", "Miễn phí", "Trả phí", "Đăng ký"];
  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
        Giá cả
      </h3>
      <div className="flex flex-wrap gap-2">
        {prices.map((price, i) => (
          <span
            key={price}
            className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors ${i === 0 ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"}`}
          >
            {price}
          </span>
        ))}
      </div>
    </section>
  );
}
