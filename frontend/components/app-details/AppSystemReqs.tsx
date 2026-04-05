import { useAppDetailStore } from "../../store/useAppDetailStore";

export default function AppSystemReqs() {
  const { appInfo } = useAppDetailStore();
  const reqs = appInfo?.systemRequirements;

  const min = reqs?.min
    ? [
        { l: "HĐH", v: reqs.min.os || "Không rõ" },
        { l: "Bộ xử lý", v: reqs.min.cpu || "Không rõ" },
        { l: "RAM", v: reqs.min.ram || "Không rõ" },
        { l: "Đồ họa", v: reqs.min.graphics || "Không rõ" },
      ]
    : [];

  const rec = reqs?.recommended
    ? [
        { l: "HĐH", v: reqs.recommended.os || "Không rõ" },
        { l: "Bộ xử lý", v: reqs.recommended.cpu || "Không rõ" },
        { l: "RAM", v: reqs.recommended.ram || "Không rõ" },
        { l: "Đồ họa", v: reqs.recommended.graphics || "Không rõ" },
      ]
    : [];
  return (
    <section className="bg-surface-container-low p-8 rounded-3xl">
      <h3 className="text-2xl font-bold mb-6">Yêu cầu hệ thống</h3>
      <div className="space-y-8">
        {min.length > 0 && (
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
              Tối thiểu
            </h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              {min.map((i, k) => (
                <li key={k} className="flex justify-between">
                  <span className="font-medium">{i.l}</span>
                  <span className="text-right max-w-[60%]">{i.v}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {rec.length > 0 && (
          <div className="pt-6 border-t border-outline-variant/20">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
              Khuyến nghị
            </h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              {rec.map((i, k) => (
                <li key={k} className="flex justify-between">
                  <span className="font-medium">{i.l}</span>
                  <span className="text-right max-w-[60%]">{i.v}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!reqs && (
          <p className="text-sm text-on-surface-variant">
            Chưa có thông tin cấu hình hệ thống.
          </p>
        )}
      </div>
    </section>
  );
}
