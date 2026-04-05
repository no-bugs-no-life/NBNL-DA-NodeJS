export default function AppStats() {
  return (
    <div className="flex flex-wrap gap-8 py-2">
      <div className="flex flex-col">
        <span className="text-sm text-on-surface-variant font-medium">
          Xếp hạng
        </span>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-lg font-bold">4.8</span>
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="text-sm text-on-surface-variant ml-1">(25K)</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-on-surface-variant font-medium">
          Kích thước
        </span>
        <span className="text-lg font-bold mt-1">2.4 GB</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-on-surface-variant font-medium">
          Nền tảng
        </span>
        <span className="text-lg font-bold mt-1">PC / Tablet</span>
      </div>
    </div>
  );
}
