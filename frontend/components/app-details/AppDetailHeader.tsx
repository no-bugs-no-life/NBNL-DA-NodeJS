import { useAppDetailStore } from "../../store/useAppDetailStore";
import AppStats from "./AppStats";

export default function AppDetailHeader() {
  const { appInfo } = useAppDetailStore();
  if (!appInfo) return null;
  return (
    <header className="relative py-12 flex flex-col md:flex-row items-start gap-10">
      <div className="w-48 h-48 rounded-[32px] bg-white shadow-xl flex-shrink-0 flex items-center justify-center p-4">
        {appInfo.iconUrl && (
          <img
            alt={appInfo.name}
            className="w-full h-full object-contain"
            src={appInfo.iconUrl}
          />
        )}
      </div>
      <div className="flex-grow space-y-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-on-background mb-2">
            {appInfo.name}
          </h1>
          <p className="text-xl text-primary font-medium">{appInfo.developerId?.fullName || "Developer"}</p>
        </div>
        <AppStats />
        <div className="flex gap-4 items-center">
          <button className="primary-cta text-on-primary px-10 py-3 rounded-lg font-semibold text-lg shadow-lg hover:brightness-110 transition-all scale-95 duration-150 ease-in-out active:scale-90">
            {appInfo.price === 0 ? "Tải về ngay" : `Mua ngay: $${appInfo.price}`}
          </button>
          <button className="bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-semibold text-lg hover:bg-surface-dim transition-colors">
            Dùng thử miễn phí
          </button>
        </div>
      </div>
    </header>
  );
}
