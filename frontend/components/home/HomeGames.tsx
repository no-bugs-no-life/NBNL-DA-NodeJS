"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProductItem } from "@/store/useHomeStore";

export default function HomeGames() {
  const { data: bestSellingGames = [], isLoading } = useQuery({
    queryKey: ["products", "bestselling"],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await axios.get(`${apiUrl}/api/v1/products?limit=6`);
      return response.data;
    },
  });

  if (isLoading || bestSellingGames.length === 0) return null;

  return (
    <section className="px-8 max-w-screen-2xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Best-selling Games
        </h2>
        <Link
          href="/apps"
          className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
        >
          See all{" "}
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {bestSellingGames.slice(0, 6).map((game: ProductItem, idx: number) => (
          <Link
            key={game._id || idx}
            href={`/apps/${game._id}`}
            className="flex flex-col gap-3 group cursor-pointer block"
          >
            <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1 bg-surface-container">
              {game.images && game.images.length > 0 ? (
                <img
                  className="w-full h-full object-cover"
                  alt={game.title}
                  src={game.images[0]}
                />
              ) : (
                <div className="w-full h-full object-cover"></div> // Placeholder fallback if no images array is loaded
              )}
              {idx === 0 && ( // Showing a mock GAME PASS badge on first game
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold">
                  GAME PASS
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm truncate">{game.title}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs ${game.price === 0 ? 'text-tertiary font-bold' : 'text-on-surface-variant'}`}>
                  {game.price === 0 ? "Free" : `$${game.price}`}
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
