"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import GameCard from "./GameCard";
import { GameItem } from "./types";
import { API_URL } from "@/configs/api";

export default function GameGrid() {
  const [displayedCount, setDisplayedCount] = useState(6);

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["apps", "games"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/api/v1/apps?type=game&limit=50`,
      );
      return response.data?.docs || response.data;
    },
  });

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 6);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-on-surface-variant">
        Đang tải trò chơi...
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {games.slice(0, displayedCount).map((game: GameItem) => (
          <GameCard key={game._id || game.slug} game={game} />
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
