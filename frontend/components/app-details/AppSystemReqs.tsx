export default function AppSystemReqs() {
  const min = [
    { l: "HĐH", v: "Windows 10 64-bit" },
    { l: "Bộ xử lý", v: "Intel Core i5" },
    { l: "RAM", v: "8 GB" },
    { l: "Đồ họa", v: "DirectX 12 support" },
  ];
  const rec = [
    { l: "HĐH", v: "Windows 11" },
    { l: "Bộ xử lý", v: "Intel Core i7+" },
    { l: "RAM", v: "16 GB hoặc hơn" },
    { l: "Đồ họa", v: "4GB VRAM GPU" },
  ];
  return (
    <section className="bg-surface-container-low p-8 rounded-3xl">
      <h3 className="text-2xl font-bold mb-6">Yêu cầu hệ thống</h3>
      <div className="space-y-8">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
            Tối thiểu
          </h4>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            {min.map((i, k) => (
              <li key={k} className="flex justify-between">
                <span className="font-medium">{i.l}</span>
                <span>{i.v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-6 border-t border-outline-variant/20">
          <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
            Khuyến nghị
          </h4>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            {rec.map((i, k) => (
              <li key={k} className="flex justify-between">
                <span className="font-medium">{i.l}</span>
                <span>{i.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
