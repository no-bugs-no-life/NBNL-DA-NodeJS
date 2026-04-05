import { AppItem } from "../types";

export default function ProductCardHeader({ app }: { app: AppItem }) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center overflow-hidden shrink-0">
        <img alt="App Icon" className="w-12 h-12" src={app.iconSrc} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-on-surface truncate group-hover:text-primary transition-colors">
          {app.title}
        </h4>
        <p className="text-xs text-on-surface-variant mb-2">{app.company}</p>
        <div className="flex items-center gap-1 text-tertiary">
          <span
            className="material-symbols-outlined text-[14px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="text-xs font-bold">{app.rating}</span>
          <span className="text-[10px] text-slate-400 font-normal ml-1">
            ({app.reviews})
          </span>
        </div>
      </div>
    </div>
  );
}
