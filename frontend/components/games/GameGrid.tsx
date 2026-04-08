"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GameCard from "./GameCard";
import { GameItem } from "./types";
import api from "@/lib/axios";
import { API_URL } from "@/configs/api";

interface ApiTag {
  _id?: string;
  name?: string;
}

interface ApiCategory {
  _id?: string;
  name?: string;
}

interface ApiApp {
  _id: string;
  slug?: string;
  name: string;
  price?: number;
  ratingScore?: number;
  iconUrl?: string;
  category?: ApiCategory | string;
  tags?: (ApiTag | string)[];
}

interface CategoryItem {
  _id: string;
  name: string;
}

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

const normalizeTags = (tags: (ApiTag | string)[] = []) =>
  tags
    .map((t) => (typeof t === "string" ? t : t?.name || ""))
    .filter(Boolean);

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const isGameLike = (app: ApiApp) => {
  const categoryName =
    typeof app.category === "string" ? "" : (app.category?.name || "");
  const tags = normalizeTags(app.tags || []).join(" ").toLowerCase();
  const name = (app.name || "").toLowerCase();
  const category = categoryName.toLowerCase();

  return (
    category.includes("game") ||
    category.includes("trò chơi") ||
    tags.includes("game") ||
    tags.includes("gaming") ||
    name.includes("game")
  );
};

const isGameCategoryName = (name: string) => {
  const normalized = normalizeText(name);
  return normalized.includes("game") || normalized.includes("tro choi");
};

export default function GameGrid() {
  const [displayedCount, setDisplayedCount] = useState(6);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["apps", "games"],
    queryFn: async () => {
      const [appsResponse, categoriesResponse] = await Promise.all([
        api.get(`/api/v1/apps?status=published&limit=100`),
        api.get(`/api/v1/categories?limit=100`),
      ]);

      const appsPayload = appsResponse.data?.data ?? appsResponse.data;
      const appDocs = appsPayload?.docs ?? appsPayload?.items ?? appsPayload;
      const appsArray = Array.isArray(appDocs) ? appDocs : [];

      const categoriesPayload =
        categoriesResponse.data?.data ?? categoriesResponse.data;
      const categoryDocs =
        categoriesPayload?.docs ?? categoriesPayload?.items ?? categoriesPayload;
      const categoriesArray = Array.isArray(categoryDocs) ? categoryDocs : [];

      return {
        apps: appsArray as ApiApp[],
        categories: categoriesArray as CategoryItem[],
      };
    },
  });

  const games = useMemo(() => {
    const source = data?.apps || [];
    const categories = data?.categories || [];

    const gameCategoryIds = new Set(
      categories
        .filter((cat) => isGameCategoryName(cat.name || ""))
        .map((cat) => cat._id),
    );

    let filteredByCategory: ApiApp[] = [];

    if (gameCategoryIds.size > 0) {
      filteredByCategory = source.filter((app) => {
        const category = app.category;
        if (!category) return false;

        if (typeof category === "string") {
          return gameCategoryIds.has(category);
        }

        return Boolean(category._id && gameCategoryIds.has(category._id));
      });
    }

    const finalApps =
      filteredByCategory.length > 0
        ? filteredByCategory
        : source.filter((app) => isGameLike(app));

    const safeApps = finalApps.length > 0 ? finalApps : source;

    return safeApps.map(
      (item): GameItem => ({
        _id: item._id,
        slug: item.slug,
        name: item.name,
        price: item.price ?? 0,
        ratingScore: item.ratingScore,
        iconUrl: normalizeIcon(item.iconUrl),
        tags: normalizeTags(item.tags || []),
      }),
    );
  }, [data]);

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

  if (isError) {
    return (
      <div className="text-center py-12 text-on-surface-variant">
        <p className="mb-3">Không tải được dữ liệu trò chơi.</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-sm font-semibold"
        >
          Thử lại
        </button>
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
