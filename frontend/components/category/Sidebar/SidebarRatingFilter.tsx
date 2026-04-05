export function SidebarRatingFilter() {
  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
        Đánh giá tối thiểu
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-primary">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          ))}
          <span className="material-symbols-outlined text-sm text-outline-variant">
            star
          </span>
          <span className="ml-2 text-xs font-medium text-on-surface-variant">
            4.0 trở lên
          </span>
        </div>
        <input
          className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
          type="range"
          defaultValue="80"
        />
      </div>
    </section>
  );
}
