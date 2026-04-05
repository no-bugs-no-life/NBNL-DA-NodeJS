import { useAppDetailStore } from "../../store/useAppDetailStore";

export default function AppExtraInfo() {
  const { appInfo } = useAppDetailStore();

  const info = [];
  if (appInfo?.languageSupportCount) {
    info.push({ icon: "language", text: `Hỗ trợ ${appInfo.languageSupportCount} ngôn ngữ` });
  }

  if (appInfo?.securityVerified) {
    info.push({ icon: "verified_user", text: "Đã được xác minh bảo mật" });
  }

  if (appInfo?.inAppPurchases) {
    info.push({ icon: "share", text: "Bao gồm mua hàng trong ứng dụng" });
  }
  return (
    <section className="px-2">
      <h3 className="text-xl font-bold mb-6">Thông tin thêm</h3>
      <div className="space-y-4">
        {info.map((i, k) => (
          <div
            key={k}
            className="flex items-center gap-4 text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-primary">
              {i.icon}
            </span>
            <span className="text-sm">{i.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
