interface SearchResultHeaderProps {
  query: string;
  count: number;
}

export default function SearchResultHeader({
  query,
  count,
}: SearchResultHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2 outline-none">
        Kết quả tìm kiếm cho:{" "}
        <span className="text-primary">&quot;{query}&quot;</span>
      </h1>
      <p className="text-on-surface-variant">
        Tìm thấy {count} kết quả phù hợp.
      </p>
    </div>
  );
}
