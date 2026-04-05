"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAppDetailStore } from "../../../store/useAppDetailStore";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import AppDetailHeader from "../../../components/app-details/AppDetailHeader";
import AppOverview from "../../../components/app-details/AppOverview";
import AppScreenshots from "../../../components/app-details/AppScreenshots";
import AppReviews from "../../../components/app-details/AppReviews";
import AppSystemReqs from "../../../components/app-details/AppSystemReqs";
import AppExtraInfo from "../../../components/app-details/AppExtraInfo";
import AppDeveloperInfo from "../../../components/app-details/AppDeveloperInfo";
import AppTags from "../../../components/app-details/AppTags";
import { API_URL } from "@/configs/api";

export default function AppDetailsPage() {
  const { slug } = useParams();
  const { setAppInfo, setIsLoading } = useAppDetailStore();

  const { data, isLoading } = useQuery({
    queryKey: ["app-detail", slug],
    queryFn: async () => {
      
      const response = await axios.get(`${API_URL}/api/v1/apps/detail/${slug}`);
      return response.data;
    },
    enabled: !!slug
  });

  useEffect(() => {
    if (data) {
      setAppInfo(data);
      setIsLoading(false);
    } else if (!isLoading) {
      setIsLoading(false);
    }
  }, [data, isLoading, setAppInfo, setIsLoading]);

  if (isLoading) return (
    <>
      <Navbar />
      <main className="mt-20 max-w-7xl mx-auto px-6 lg:px-8 pb-24 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-32 h-32 rounded-3xl bg-surface-container-highest shrink-0"></div>
          <div className="flex-1 space-y-4 pt-2">
            <div className="h-8 bg-surface-container-highest rounded-full w-1/3"></div>
            <div className="h-4 bg-surface-container-highest rounded-full w-1/4"></div>
            <div className="flex gap-4 pt-4">
              <div className="h-12 bg-surface-container-highest rounded-full w-32"></div>
              <div className="h-12 bg-surface-container-highest rounded-full w-12"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2 space-y-16">
            <div className="space-y-4">
              <div className="h-6 bg-surface-container-highest rounded-full w-1/4 mb-6"></div>
              <div className="h-24 bg-surface-container-highest rounded-2xl w-full"></div>
            </div>
            <div className="h-64 bg-surface-container-highest rounded-3xl w-full"></div>
          </div>
          <div className="space-y-12">
            <div className="h-64 bg-surface-container-highest rounded-3xl w-full"></div>
            <div className="h-40 bg-surface-container-highest rounded-3xl w-full"></div>
            <div className="h-40 bg-surface-container-highest rounded-3xl w-full"></div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
  if (!data) return <div className="h-screen flex items-center justify-center p-8 flex-col gap-4">
    <h1 className="text-3xl font-bold">App not found</h1>
    <p>The app you are looking for might have been removed or is temporarily unavailable.</p>
  </div>;

  return (
    <>
      <Navbar />
      <main className="mt-20 max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <AppDetailHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2 space-y-16">
            <AppOverview />
            <AppScreenshots />
            <AppReviews />
          </div>
          <div className="space-y-12">
            <AppSystemReqs />
            <AppExtraInfo />
            <AppTags />
            <AppDeveloperInfo />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
