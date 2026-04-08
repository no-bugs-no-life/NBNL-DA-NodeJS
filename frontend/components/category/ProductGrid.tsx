"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { AppItem } from "./types";
import api from "@/lib/axios";
import { API_URL } from "@/configs/api";

export default function ProductGrid({
  categoryId,
  searchQuery,
  tag,
}: {
  categoryId?: string;
  searchQuery?: string;
  tag?: string;
}) {
  const [displayedCount, setDisplayedCount] = useState(8);

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["apps", "all", categoryId || "", searchQuery || "", tag || ""],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "50" });
      if (categoryId) params.set("category", categoryId);
      if (searchQuery?.trim()) params.set("search", searchQuery.trim());
      if (tag?.trim()) params.set("tags", tag.trim());

      const endpoint = `/api/v1/apps?${params.toString()}`;
      const response = await api.get(endpoint);
      interface ApiApp {
        _id: string;
        slug: string;
        name: string;
        developerId?: { name?: string };
        developer?: { name?: string };
        price: number;
        iconUrl?: string;
      }

      const rawData =
        response.data?.data?.docs ||
        response.data?.data ||
        response.data?.docs ||
        response.data;
      const arr = Array.isArray(rawData) ? rawData : [];

      const normalizeIcon = (iconUrl?: string) => {
        if (!iconUrl) return "";
        if (
          iconUrl.startsWith("http") ||
          iconUrl.startsWith("blob:") ||
          iconUrl.startsWith("data:")
        ) {
          return iconUrl;
        }
        return `${API_URL}/${iconUrl.replace(/\\/g, "/")}`;
      };

      return arr.map((item: ApiApp) => ({
        id: item._id,
        slug: item.slug,
        title: item.name,
        company: item.developer?.name || item.developerId?.name || "Developer",
        rating: "4.5",
        reviews: "1K+",
        price: item.price === 0 ? "Miễn phí" : `$${item.price}`,
        action: "Cài đặt",
        iconSrc:
          normalizeIcon(item.iconUrl) ||
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCae2BgwTaS1UNAnXhe2rBFaF4xGuLmY_ph14CUhreqQS26LD0iD_V6g1IWuQtXBqRZGyIkj0Gp5ItLGgZ7Rk4LvHmv3KM25nx4tLvudtoCOL_4e4MVoc4kvF0A_ghWRoP6-L5wJFvHV4FJ2e4ZBHNAb36iaIrrK1cLNuJKF26aHVIEdl7Nu_OmSya-KPKnpi02Kv1smpp6l9So71GM53ViB7u3Fwc2-ZgYOaHL77ingE9hNNifTxs-QFa0bsggXc8YeHNzbsk-5JQ",
      }));
    },
  });

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 8);
  };

  if (isLoading)
    return (
      <div className="p-8 text-center">Đang tải danh sách ứng dụng...</div>
    );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {apps.slice(0, displayedCount).map((app: AppItem) => (
          <Link key={app.id} href={`/apps/${app.slug}`}>
            <ProductCard app={app} />
          </Link>
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
