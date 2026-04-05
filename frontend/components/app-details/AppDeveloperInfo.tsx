import { useAppDetailStore } from "../../store/useAppDetailStore";

export default function AppDeveloperInfo() {
  const { appInfo } = useAppDetailStore();
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
      <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
        Nhà phát triển
      </h3>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center p-1 overflow-hidden">
          {appInfo?.developerId?.avatarUrl ? (
            <img
              alt={appInfo?.developerId?.fullName}
              src={appInfo?.developerId?.avatarUrl}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant">
              person
            </span>
          )}
        </div>
        <div>
          <p className="font-bold">
            {appInfo?.developerId?.fullName || "Developer"}
          </p>
          <a
            className="text-primary text-sm font-medium hover:underline"
            href="#"
          >
            {appInfo?.developerId?.email || "Xem tất cả ứng dụng"}
          </a>
        </div>
      </div>
    </div>
  );
}
