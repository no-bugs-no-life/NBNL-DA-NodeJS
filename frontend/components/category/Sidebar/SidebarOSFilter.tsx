export function SidebarOSFilter() {
  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
        Hệ điều hành
      </h3>
      <div className="space-y-3">
        {["Windows", "macOS", "Linux"].map((os, i) => (
          <label
            key={os}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              defaultChecked={i === 0}
              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20"
              type="checkbox"
            />
            <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
              {os}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
