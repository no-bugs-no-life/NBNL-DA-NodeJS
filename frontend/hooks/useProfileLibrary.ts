import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/store/useAuthStore";
import { API_URL } from "@/configs/api";

export interface LibraryItem {
  id: string;
  appId: string;
  title: string;
  image: string;
  playTime: number;
  lastPlayed: string;
  installedAt?: string;
  type: "game" | "app";
}

interface LibraryApiItem {
  id: string;
  appId: string;
  title: string;
  image: string;
  playTime: number;
  lastPlayed: string;
  installedAt?: string;
  type: "game" | "app";
}

const FALLBACK_IMAGE = "https://i.sstatic.net/l60Hf.png";

const normalizeImage = (image?: string) => {
  if (!image) return FALLBACK_IMAGE;
  if (
    image.startsWith("http") ||
    image.startsWith("blob:") ||
    image.startsWith("data:")
  ) {
    return image;
  }
  return `${API_URL}/${image.replace(/\\/g, "/")}`;
};

export function useProfileLibrary() {
  const query = useQuery({
    queryKey: ["profile", "library"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/library/my");
      const payload = response.data?.data ?? response.data;
      return (Array.isArray(payload) ? payload : []) as LibraryApiItem[];
    },
  });

  const items = useMemo<LibraryItem[]>(() => {
    return (query.data ?? []).map((item) => ({
      id: item.id,
      appId: item.appId || item.id,
      title: item.title,
      image: normalizeImage(item.image),
      playTime: typeof item.playTime === "number" ? item.playTime : 0,
      lastPlayed: item.lastPlayed || item.installedAt || new Date().toISOString(),
      installedAt: item.installedAt,
      type: item.type === "game" ? "game" : "app",
    }));
  }, [query.data]);

  return {
    ...query,
    items,
  };
}
