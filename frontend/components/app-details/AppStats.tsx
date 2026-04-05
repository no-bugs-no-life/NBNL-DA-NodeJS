import { useAppDetailStore } from "../../store/useAppDetailStore";

export default function AppStats() {
  const { appInfo } = useAppDetailStore();

  if (!appInfo) return null;

  const ratingCountFormatted =
    appInfo.ratingCount && appInfo.ratingCount >= 1000
      ? `${(appInfo.ratingCount / 1000).toFixed(1)}K`
      : appInfo.ratingCount || 0;

  return (
    <div className="flex flex-wrap gap-8 py-2">
      <div className="flex flex-col">
        <span className="text-sm text-on-surface-variant font-medium">
          Xếp hạng
        </span>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-lg font-bold">
            {appInfo.ratingScore?.toFixed(1) || "0.0"}
          </span>
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="text-sm text-on-surface-variant ml-1">
            ({ratingCountFormatted})
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-on-surface-variant font-medium">
          Kích thước
        </span>
        <span className="text-lg font-bold mt-1">
          {appInfo.size || "Unknown"}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-on-surface-variant font-medium">
          Nền tảng
        </span>
        <span className="text-lg font-bold mt-1">
          {appInfo.platforms?.join(" / ") || "Unknown"}
        </span>
      </div>
    </div>
  );
}
