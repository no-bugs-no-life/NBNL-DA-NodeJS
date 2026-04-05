import Link from "next/link";
import { mockCategories } from "../../category/data";

export default function NavLinks() {
  return (
    <div className="hidden md:flex items-center gap-6 text-sm font-medium tracking-tight">
      <Link
        className="text-slate-600 hover:text-slate-900 transition-colors"
        href="/"
      >
        Home
      </Link>
      <Link
        className="text-blue-700 border-b-2 border-blue-700 pb-1"
        href="/apps"
      >
        Apps
      </Link>
      <Link
        className="text-slate-600 hover:text-slate-900 transition-colors"
        href="/games"
      >
        Games
      </Link>

      {/* Category Mega Menu */}
      <div className="relative group">
        <Link
          className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          href="/category"
        >
          Category
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </Link>

        {/* Dropdown Content */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="bg-surface-container-lowest shadow-xl rounded-2xl p-6 border border-outline/10 w-[600px] grid grid-cols-2 gap-4">
            {mockCategories.map((c) => (
              <Link
                key={c._id}
                href={`/category/${c._id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors group/item"
              >
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary">
                    {c.iconUrl}
                  </span>
                </div>
                <span className="font-semibold text-on-surface group-hover/item:text-primary transition-colors">
                  {c.name}
                </span>
              </Link>
            ))}
            <Link
              href="/category"
              className="col-span-2 flex items-center justify-center gap-2 p-3 mt-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors font-semibold text-primary"
            >
              Xem tất cả danh mục
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      <Link
        className="text-slate-600 hover:text-slate-900 transition-colors"
        href="/deals"
      >
        Deals
      </Link>
    </div>
  );
}
