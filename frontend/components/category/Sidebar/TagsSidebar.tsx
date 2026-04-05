import Link from "next/link";

export const mockTags = [
    "Thiết kế",
    "Đồ họa",
    "Chỉnh sửa ảnh",
    "Phần mềm",
    "Công cụ AI",
    "Năng suất",
    "Tiện ích",
    "Lập trình"
];

export default function TagsSidebar() {
    return (
        <aside className="w-full md:w-72 flex-shrink-0 space-y-8">
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-on-surface">
                    Từ khóa (Tags)
                </h1>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                    Khám phá và lọc ứng dụng theo các từ khóa phổ biến.
                </p>
            </div>

            <nav className="flex flex-wrap gap-2">
                {mockTags.map((t, idx) => (
                    <Link
                        key={idx}
                        href={`/tags/${encodeURIComponent(t)}`}
                        className="px-4 py-2 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-full border border-outline/10 text-on-surface-variant hover:text-primary text-sm font-medium inline-block"
                    >
                        {t}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
