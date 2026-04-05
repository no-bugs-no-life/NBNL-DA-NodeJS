export default function AppExtraInfo() {
  const info = [
    { icon: "language", text: "Hỗ trợ 26 ngôn ngữ" },
    { icon: "verified_user", text: "Đã được xác minh bảo mật" },
    { icon: "share", text: "Bao gồm mua hàng trong ứng dụng" },
  ];
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
