import { SidebarOSFilter } from "./SidebarOSFilter";
import { SidebarPriceFilter } from "./SidebarPriceFilter";
import { SidebarRatingFilter } from "./SidebarRatingFilter";

export default function Sidebar() {
  return (
    <aside className="w-full md:w-72 flex-shrink-0 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-on-surface">
          Năng suất
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Nâng cao hiệu quả làm việc của bạn với những công cụ hàng đầu.
        </p>
      </div>
      <div className="space-y-8">
        <SidebarOSFilter />
        <SidebarPriceFilter />
        <SidebarRatingFilter />
      </div>
    </aside>
  );
}
