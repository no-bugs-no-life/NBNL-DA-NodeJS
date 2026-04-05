"use client";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";

export default function Sidebar() {
  const { data: categories = [], isLoading } = useCategories();

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
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl animate-pulse bg-surface-container-high h-12" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          categories.map((c) => (
            <Link
              key={c._id}
              href={`/category/${c._id}`}
              className="px-4 py-3 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface font-semibold block"
            >
              {c.name}
            </Link>
          ))
        ) : (
          <p className="text-sm text-on-surface-variant px-4">Không có danh mục nào.</p>
        )}
      </nav>
    </aside>
  );
}
