import Link from "next/link";
import { mockCategories } from "../data";

export default function Sidebar() {
  return (
    <aside className="w-full md:w-72 flex-shrink-0 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-on-surface">
          Danh mục
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Khám phá các ứng dụng và trò chơi theo chủ đề.
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {mockCategories.map((c) => (
          <Link
            key={c._id}
            href={`/category/${c._id}`}
            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface group"
          >
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
              {c.iconUrl}
            </span>
            <span className="font-semibold">{c.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
