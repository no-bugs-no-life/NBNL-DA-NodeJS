import Link from "next/link";
import { useAppDetailStore } from "../../store/useAppDetailStore";

export default function AppTags() {
  const { appInfo } = useAppDetailStore();

  // Use some default placeholder tags if not provided, for visual testing
  let tags = appInfo?.tags;
  if (!tags || tags.length === 0) {
    tags = ["Thiết kế", "Đồ họa", "Chỉnh sửa ảnh", "Phần mềm", "Công cụ AI"];
  }

  return (
    <section className="px-2 mt-8">
      <h3 className="text-xl font-bold mb-6">Từ khóa (Tags)</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <Link
            href={`/tags/${encodeURIComponent(tag)}`}
            key={i}
            className="no-underline"
          >
            <span className="bg-surface-container-low hover:bg-surface-container-high transition-colors px-4 py-2 rounded-xl text-sm font-medium border border-outline/20 inline-block text-on-surface-variant hover:text-primary">
              {tag}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
