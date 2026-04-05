export default function AppOverview() {
  const features = [
    {
      icon: "auto_fix_high",
      desc: "Công cụ AI Firefly tích hợp để tạo và mở rộng hình ảnh thông minh.",
    },
    {
      icon: "layers",
      desc: "Hệ thống lớp nâng cao cho phép chỉnh sửa không phá hủy và quản lý phức tạp.",
    },
    {
      icon: "brush",
      desc: "Hàng nghìn bút vẽ kỹ thuật số chuyên nghiệp và tùy chỉnh.",
    },
    {
      icon: "cloud_done",
      desc: "Đồng bộ hóa đám mây mượt mà giữa các thiết bị máy tính và iPad.",
    },
  ];
  return (
    <section>
      <h2 className="text-3xl font-bold tracking-tight mb-8">Tổng quan</h2>
      <div className="prose prose-slate max-w-none text-on-surface-variant leading-relaxed text-lg">
        <p className="mb-6">
          Chào mừng bạn đến với tiêu chuẩn vàng của chỉnh sửa hình ảnh kỹ thuật
          số. Adobe Photoshop là phần mềm thiết kế và hình ảnh tốt nhất thế
          giới, hỗ trợ hầu hết mọi dự án sáng tạo từ chỉnh sửa và tổng hợp ảnh
          đến vẽ kỹ thuật số, hoạt ảnh và thiết kế đồ họa.
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
