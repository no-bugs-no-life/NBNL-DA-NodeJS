"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GameItem } from "@/components/games/types";
import { API_URL } from "@/configs/api";

export default function HomeGames() {
  const { data: bestSellingGames = [], isLoading } = useQuery({
    queryKey: ["apps", "bestselling-games"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/api/v1/apps?type=game&flag=bestseller&limit=6`,
      );
      const payload = response.data?.data;
      return Array.isArray(payload) ? payload : payload?.docs || [];
    },
  });

  if (isLoading || bestSellingGames.length === 0) return null;

  return (
    <section className="px-8 max-w-screen-2xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Trò chơi bán chạy nhất
        </h2>
        <Link
          href="/games"
          className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
        >
          Xem tất cả{" "}
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {bestSellingGames.slice(0, 6).map((game: GameItem, idx: number) => (
          <Link
            key={game._id || idx}
            href={`/apps/${game.slug}`}
            className="flex flex-col gap-3 group cursor-pointer block"
          >
            <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1 bg-surface-container">
              {game.iconUrl ? (
                <img
                  className="w-full h-full object-cover"
                  alt={game.name}
                  src={game.iconUrl}
                />
              ) : (
                <div className="w-full h-full object-cover bg-slate-800"></div>
              )}
              {idx === 0 && (
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold">
                  GAME PASS
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm truncate">{game.name}</h4>
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`text-xs ${game.price === 0 ? "text-tertiary font-bold" : "text-on-surface-variant"}`}
                >
                  {game.price === 0 ? "Miễn phí" : `$${game.price}`}
                </span>
                <div className="flex items-center text-amber-500 text-[10px]">
                  <span
                    className="material-symbols-outlined text-[10px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="ml-0.5">
                    {game.ratingScore ? game.ratingScore.toFixed(1) : "0.0"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
