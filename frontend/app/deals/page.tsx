"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CategorySidebar from "@/components/category/Sidebar";
import DealHero from "@/components/deals/DealHero";
import DealGrid from "@/components/deals/DealGrid";
import { fallbackDeals, mapAppsToDeals } from "@/components/deals/data";
import axios from "@/lib/axios";

export default function DealsPage() {
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["deals", "apps"],
    queryFn: async () => {
      const res = await axios.get(
        "/api/v1/apps?status=published&limit=40&sortBy=priority&sortOrder=desc",
      );
      const payload = res.data?.data;
      const apps = Array.isArray(payload) ? payload : payload?.docs || [];
      const mapped = mapAppsToDeals(apps);
      return mapped.length > 0 ? mapped : fallbackDeals;
    },
  });

  const featuredDeal = useMemo(() => {
    return deals.find((d) => d.isFeatured) || deals[0] || fallbackDeals[0];
  }, [deals]);

  const gridDeals = useMemo(() => {
    return deals.filter((d) => d.id !== featuredDeal?.id);
  }, [deals, featuredDeal]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full lg:w-64 flex-shrink-0">
        <CategorySidebar />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-8">
        <DealHero featuredDeal={featuredDeal} />

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-on-surface">Tất cả khuyến mãi</h2>
            {isLoading && (
              <span className="text-sm text-on-surface-variant">Đang tải...</span>
            )}
          </div>
          <DealGrid deals={gridDeals.length > 0 ? gridDeals : deals} />
        </section>
      </div>
    </div>
  );
}
