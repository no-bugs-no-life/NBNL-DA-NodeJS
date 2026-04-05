import { useAppDetailStore } from "../../store/useAppDetailStore";

export default function AppOverview() {
  const { appInfo } = useAppDetailStore();
  const features = appInfo?.features && appInfo.features.length > 0 ? appInfo.features : [
    {
      icon: "auto_fix_high",
      desc: "Công cụ thông minh đã tích hợp.",
    }
  ];
  return (
    <section>
      <h2 className="text-3xl font-bold tracking-tight mb-8">Tổng quan</h2>
      <div className="prose prose-slate max-w-none text-on-surface-variant leading-relaxed text-lg">
        <p className="mb-6 whitespace-pre-wrap">
          {appInfo?.description || "Không có thông tin mô tả."}
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
          {features.map((f, i) => (
            <li
              key={i}
              className="flex items-start gap-3 bg-surface-container-low p-4 rounded-xl"
            >
              <span className="material-symbols-outlined text-primary mt-1">
                {f.icon}
              </span>
              <span>{f.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
