"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AppItem } from "@/store/useHomeStore";
import { API_URL } from "@/configs/api";

export default function HomeProductivity() {
  const { data: productivityApps = [], isLoading } = useQuery({
    queryKey: ["apps", "productivity"],
    queryFn: async () => {
      
      const response = await axios.get(`${API_URL}/api/v1/apps?limit=3`);
      return response.data?.docs || response.data;
    },
  });

  if (isLoading || productivityApps.length === 0) return null;

  return (
    <section className="px-4 sm:px-8 max-w-screen-2xl mx-auto mb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Duy trì hiệu suất</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Công cụ giúp bạn làm được nhiều việc hơn, dễ dàng hơn.
          </p>
        </div>
        <Link
          href="/apps"
          className="bg-surface-container-high px-6 py-2 rounded-lg font-bold text-sm hover:bg-surface-dim transition-colors shrink-0 w-full sm:w-auto text-center"
        >
          Quản lý ứng dụng
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productivityApps.slice(0, 3).map((app: AppItem, idx: number) => (
          <Link
            key={app._id || idx}
            href={`/apps/${app.slug}`}
            className="flex items-center gap-5 p-4 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group block"
          >
            <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-primary text-3xl font-bold">
                {["description", "analytics", "mail"][idx % 3]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold truncate">{app.name}</h4>
              <p className="text-xs text-on-surface-variant truncate">
                {app.description}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${app.price === 0 ? "bg-tertiary-container/10 text-tertiary" : "bg-surface-container-highest text-on-surface"}`}>
                  {app.price === 0 ? "Miễn phí" : `$${app.price}`}
                </span>
                <div className="flex items-center text-amber-500 text-[10px]">
                  <span
                    className="material-symbols-outlined text-[10px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="ml-0.5">{(4.9 - (idx * 0.1)).toFixed(1)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
