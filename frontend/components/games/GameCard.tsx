import Link from "next/link";
import { GameItem } from "./types";

export default function GameCard({ game }: { game: GameItem }) {
  return (
    <Link
      href={`/apps/${game.slug || game._id}`}
      className="flex flex-col gap-3 group cursor-pointer block"
    >
      <div className="aspect-[3/4] rounded-xl overflow-hidden relative shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1">
        <img
          className="w-full h-full object-cover"
          alt={game.name}
          src={game.iconUrl || ""}
        />
        {game.tags?.includes("GAME PASS") && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold">
            GAME PASS
          </div>
        )}
      </div>
      <div>
        <h4 className="font-bold text-sm truncate">{game.name}</h4>
        <div className="flex items-center justify-between">
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
            <span className="ml-0.5">{game.ratingScore || 4.5}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
