"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { AppItem } from "./types";

export default function ProductGrid({ apps }: { apps: AppItem[] }) {
  const [displayedCount, setDisplayedCount] = useState(4);

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 4);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {apps.slice(0, displayedCount).map((app) => (
          <ProductCard key={app.id} app={app} />
        ))}
      </div>
      {displayedCount < apps.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 bg-surface-container text-on-surface-variant font-bold text-sm rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Xem thêm kết quả
          </button>
        </div>
      )}
    </>
  );
}
