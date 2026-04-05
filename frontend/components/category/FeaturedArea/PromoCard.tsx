export default function PromoCard() {
  return (
    <div className="bg-primary-container p-8 rounded-xl flex flex-col justify-between">
      <div>
        <span
          className="material-symbols-outlined text-white text-4xl mb-4"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
        <h3 className="text-xl font-bold text-white leading-tight">
          Khám phá sức mạnh của AI trong công việc
        </h3>
      </div>
      <a
        className="text-white/90 text-sm font-semibold flex items-center gap-2 hover:gap-4 transition-all"
        href="#"
      >
        Xem bộ sưu tập{" "}
        <span className="material-symbols-outlined">arrow_forward</span>
      </a>
    </div>
  );
}
