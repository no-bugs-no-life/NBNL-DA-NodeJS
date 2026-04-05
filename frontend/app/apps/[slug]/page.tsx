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

export default function AppDetailsPage() {
  const { slug } = useParams();
  const { setAppInfo, setIsLoading } = useAppDetailStore();

  const { data, isLoading } = useQuery({
    queryKey: ["app-detail", slug],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await axios.get(`${apiUrl}/api/v1/apps/detail/${slug}`);
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

  if (isLoading) return <div className="h-screen flex items-center justify-center p-8">Loading app details...</div>;
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
