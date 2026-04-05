"use client";

import { useState } from "react";
import GameCard from "./GameCard";
import { GameItem } from "./types";

export default function GameGrid({ games }: { games: GameItem[] }) {
  const [displayedCount, setDisplayedCount] = useState(6);

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 6);
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {games.slice(0, displayedCount).map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      {displayedCount < games.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 bg-surface-container text-on-surface-variant font-bold text-sm rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Xem thêm trò chơi
          </button>
        </div>
      )}
    </>
  );
}
