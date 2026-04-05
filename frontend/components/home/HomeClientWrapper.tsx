"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useHomeStore, HomeStoreState } from "@/store/useHomeStore";
import { API_URL } from "@/configs/api";

export default function HomeClientWrapper() {
  const setHomeData = useHomeStore((state) => state.setHomeData);

  const { data, isLoading } = useQuery<Partial<HomeStoreState>>({
    queryKey: ["homeLayout"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/home`);
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setHomeData({
        trendingApps: data.trendingApps || [],
        bestSellingGames: data.bestSellingGames || [],
        collections: data.collections || [],
        productivityApps: data.productivityApps || [],
        isLoading: false,
      });
    } else if (!isLoading) {
      setHomeData({ isLoading: false });
    }
  }, [data, isLoading, setHomeData]);

  // This is a headless wrapper component solely for injecting state into Zustand.
  // It renders absolutely nothing.
  return null;
}
