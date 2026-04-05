"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useHomeStore, HomeStoreState } from "@/store/useHomeStore";

export default function HomeClientWrapper() {
    const setHomeData = useHomeStore((state) => state.setHomeData);

    const { data, isLoading } = useQuery<Partial<HomeStoreState>>({
        queryKey: ["homeLayout"],
        queryFn: async () => {
            // Fetching from your Backend API endpoint
            const response = await axios.get("http://localhost:3000/api/v1/home");
            // Replace with your actual backend port (usually 3000, 3001, or 8080)
            // I'll assume standard setup or API rewriting.
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
