"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AppItem } from "@/store/useHomeStore";
import { API_URL } from "@/configs/api";

export default function HomeTrending() {
  const { data: trendingApps = [], isLoading } = useQuery({
    queryKey: ["apps", "trending"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/apps?limit=5`);
      const payload = response.data?.data;
      return Array.isArray(payload) ? payload : payload?.docs || [];
    },
  });

  if (isLoading || trendingApps.length === 0) return null;

  const firstApp = trendingApps[0];
  const otherApps = trendingApps.slice(1, 5);

  return (
    <section className="px-8 max-w-screen-2xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Ứng dụng thịnh hành
        </h2>
        <Link
          href="/apps"
          className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
        >
          Xem tất cả{" "}
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Large featured app card */}
        {firstApp && (
          <Link
            href={`/apps/${firstApp.slug}`}
            className="md:col-span-2 lg:row-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-surface-bright transition-all duration-500"
          >
            <div>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-4xl text-primary font-bold">
                  edit_square
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{firstApp.name}</h3>
              <div
                className="text-on-surface-variant mb-6 max-w-xs block w-full whitespace-normal line-clamp-2 overflow-hidden h-[45px] [&_p]:inline [&_p]:m-0 [&_br]:hidden"
                dangerouslySetInnerHTML={{ __html: firstApp.description || "" }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center text-amber-500">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-sm font-bold text-on-surface ml-1">
                    4.8
                  </span>
                </div>
                <span className="text-sm text-on-surface-variant">
                  {firstApp.price === 0 ? "Miễn phí" : `$${firstApp.price}`}
                </span>
              </div>
              <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                Cài đặt
              </button>
            </div>
          </Link>
        )}

        {/* Other apps cards */}
        {otherApps.map((app: AppItem, idx: number) => (
          <Link
            key={app._id || idx}
            href={`/apps/${app.slug}`}
            className="bg-surface-container-lowest rounded-xl p-6 flex items-start gap-4 hover:bg-surface-bright transition-all shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)] cursor-pointer group"
          >
            <div className="w-14 h-14 bg-secondary-container/20 rounded-xl flex-shrink-0 flex items-center justify-center">
              {/* Just randomizing some icons based on index for demo purposes without having complex db icon config per field */}
              <span className="material-symbols-outlined text-secondary text-2xl">
                {["video_call", "task_alt", "music_note", "cloud"][idx % 4]}
              </span>
            </div>
            <div className="flex-1 w-full truncate">
              <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors truncate">
                {app.name}
              </h4>
              <div
                className="text-xs text-on-surface-variant mb-3 truncate block [&_p]:inline [&_p]:m-0 [&_br]:hidden"
                dangerouslySetInnerHTML={{ __html: app.description || "" }}
              />
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs font-bold ${app.price === 0 ? "text-tertiary" : "text-on-surface"}`}
                >
                  {app.price === 0 ? "Miễn phí" : `$${app.price}`}
                </span>
                <div className="flex items-center text-amber-500 text-[10px]">
                  <span
                    className="material-symbols-outlined text-[10px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="ml-0.5">{(4.0 + idx * 0.2).toFixed(1)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
