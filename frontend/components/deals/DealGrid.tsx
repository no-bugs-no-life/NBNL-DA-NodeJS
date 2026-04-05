"use client";

import { useState } from "react";
import DealCard from "./DealCard";
import { dealsData } from "./data";

export default function DealGrid() {
  const [visibleCount, setVisibleCount] = useState(8);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const visibleDeals = dealsData.slice(0, visibleCount);
  const hasMore = visibleCount < dealsData.length;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {visibleDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-full transition-colors"
          >
            Xem thêm khuyến mãi
          </button>
        </div>
      )}
    </div>
  );
}
