import Link from "next/link";
import { GameItem } from "./types";

export default function GameCard({ game }: { game: GameItem }) {
  return (
    <Link
      href={`/apps/${game.id}`}
      className="flex flex-col gap-3 group cursor-pointer block"
    >
      <div className="aspect-[3/4] rounded-xl overflow-hidden relative shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1">
        <img
          className="w-full h-full object-cover"
          alt={game.title}
          src={game.coverSrc}
        />
        {game.tags?.includes("GAME PASS") && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold">
            GAME PASS
          </div>
        )}
      </div>
      <div>
        <h4 className="font-bold text-sm truncate">{game.title}</h4>
        <div className="flex items-center justify-between">
          <span
            className={`text-xs ${game.price === "Miễn phí" ? "text-tertiary font-bold" : "text-on-surface-variant"}`}
          >
            {game.price}
          </span>
          <div className="flex items-center text-amber-500 text-[10px]">
            <span
              className="material-symbols-outlined text-[10px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="ml-0.5">{game.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
