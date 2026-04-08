"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CategoryItem } from "@/store/useHomeStore";
import { API_URL } from "@/configs/api";

type HomeCollection = CategoryItem & {
  slug?: string;
  appCount?: number;
};

function normalizeListPayload<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== "object") return [];
  const p = payload as Record<string, unknown>;
  const data = p.data as any;

  const candidates = [
    p.docs,
    p.items,
    p.results,
    data?.docs,
    data?.items,
    data?.results,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c as T[];
  }
  return [];
}

function getAssetUrl(maybeUrl?: string) {
  if (!maybeUrl) return "";
  if (maybeUrl.startsWith("http://") || maybeUrl.startsWith("https://")) return maybeUrl;
  if (maybeUrl.startsWith("data:") || maybeUrl.startsWith("blob:")) return maybeUrl;
  return `${API_URL}/${maybeUrl.replace(/\\/g, "/")}`;
}

export default function HomeCollections() {
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["categories", "home"],
    queryFn: async () => {
      const categoriesRes = await axios.get(`${API_URL}/api/v1/categories`, {
        params: { page: 1, limit: 50 },
      });
      const categories = normalizeListPayload<HomeCollection>(categoriesRes.data);

      const top = categories.filter((c) => c.parentId == null).slice(0, 2);

      const withCounts = await Promise.all(
        top.map(async (c) => {
          try {
            const appsRes = await axios.get(`${API_URL}/api/v1/apps`, {
              params: { category: c._id, page: 1, limit: 1 },
            });
            const totalDocs =
              appsRes.data?.data?.totalDocs ??
              appsRes.data?.data?.total ??
              appsRes.data?.data?.totalItems;
            const appCount = typeof totalDocs === "number" ? totalDocs : undefined;
            return { ...c, appCount };
          } catch {
            return c;
          }
        }),
      );

      return withCounts;
    },
    staleTime: 60_000,
  });

  if (isLoading || collections.length === 0) return null;

  return (
    <section className="bg-surface-container-low py-20 mb-20">
      <div className="px-8 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {collections.slice(0, 2).map((col: HomeCollection, idx: number) => (
            <Link
              key={col._id || idx}
              href={`/apps?collection=${col._id || ""}`}
              className="flex-1 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)] group cursor-pointer block"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={col.name}
                  src={idx === 0 ? "/images/home_collection_1.png" : "/images/home_collection_2.png"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white text-2xl font-bold">{col.name}</h3>
                  <p className="text-white/80 text-sm">
                    {typeof col.appCount === "number"
                      ? `${col.appCount.toLocaleString("vi-VN")} ứng dụng`
                      : col.slug
                        ? col.slug
                        : "Khám phá bộ sưu tập"}
                  </p>
                </div>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">
                      category
                    </span>
                  </div>
                  <span className="text-xs font-bold truncate">Khám phá</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">
                      api
                    </span>
                  </div>
                  <span className="text-xs font-bold truncate">Tìm hiểu</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
