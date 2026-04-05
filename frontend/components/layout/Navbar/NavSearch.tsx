"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden sm:block">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
        search
      </span>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/40 transition-all"
        placeholder="Tìm kiếm ứng dụng..."
        type="text"
      />
    </form>
  );
}
