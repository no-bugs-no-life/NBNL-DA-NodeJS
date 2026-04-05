"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/configs/api";

export default function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: heroApps = [] } = useQuery({
    queryKey: ["home", "hero"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/apps?limit=3`);
      return response.data?.docs || response.data;
    },
  });

  const fallbackSlides = [
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCvjgcGTThU-5hkonzGghyOtGc7x5MKa_AWqh-O42zfi2ol-cb5m1of9Bpu_WH_9aAIg2hXC7oVloI6jyEc7R_XGnkn6rRkPFxxThOMFFR1SU16NwM6Tr2nnfvFFNBAYBOIR0q2nM8dTArVJBU8QKalHEIxLO9yI9E3YYFdXF2_raBp4QaANIt1uIAhpIuC2Q-xVA97-GUauGmUrJlp0j7qtTZ2prSsV95DwGit3uTfCt2oFYQDsmfD3ufzrjhwAklWRXRac96VdGI",
      subtitle: "Trải nghiệm nổi bật",
      title: "Tương lai của công việc sáng tạo",
      description:
        "Khám phá đỉnh cao giải trí với gói APKBugs Suite. Tất cả những công cụ hỗ trợ trải nghiệm game một cách hoàn hảo nhất.",
      slug: "apkbugs-suite",
    },
  ];

  interface HeroAppPayload {
    name: string;
    description: string;
    slug: string;
    screenshots?: string[];
    iconUrl?: string;
    categoryId?: { name: string };
  }

  const slides =
    heroApps.length > 0
      ? heroApps.map((app: HeroAppPayload) => ({
          image:
            app.screenshots && app.screenshots.length > 0
              ? app.screenshots[0]
              : app.iconUrl || "",
          subtitle: app.categoryId?.name || "Nổi Bật",
          title: app.name,
          description: app.description,
          slug: app.slug,
        }))
      : fallbackSlides;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide] || fallbackSlides[0];

  interface SlideData {
    image: string;
    subtitle: string;
    title: string;
    description: string;
    slug?: string;
  }

  return (
    <section className="px-4 md:px-8 max-w-screen-2xl mx-auto mb-16 relative">
      <div className="relative w-full aspect-[4/5] sm:aspect-video lg:aspect-[21/9] rounded-xl overflow-hidden bg-surface-container-highest group">
        {/* Background images fade sequence */}
        {slides.map((slide: SlideData, index: number) => (
          <img
            key={index}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
            alt={slide.title}
            src={slide.image}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/20 md:to-transparent flex flex-col justify-end md:justify-center px-6 md:px-16 pb-16 md:pb-0 z-10 transition-all duration-300">
          <div key={currentSlide} className="animate-pulse">
            <span className="text-primary-fixed font-bold tracking-widest text-xs uppercase mb-2 md:mb-4 block">
              {activeSlide.subtitle}
            </span>
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4 md:mb-6 max-w-xl leading-tight md:leading-none">
              {activeSlide.title}
            </h1>
            <p className="text-white/80 text-sm sm:text-lg max-w-md mb-6 md:mb-8 leading-relaxed font-light">
              {activeSlide.description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2">
            <Link
              href={`/apps/${activeSlide.slug || ""}`}
              className="w-full sm:w-auto text-center hero-gradient text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 active:scale-95 shadow-lg shadow-primary/20"
            >
              Cài đặt ngay
            </Link>
            <Link
              href={`/apps/${activeSlide.slug || ""}`}
              className="w-full sm:w-auto text-center bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all active:scale-95 border border-white/20"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>

        <div className="absolute bottom-4 right-1/2 translate-x-1/2 md:bottom-6 md:right-16 md:translate-x-0 flex gap-2 z-20">
          {slides.map((_: unknown, idx: number) => (
            <div
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 rounded-full cursor-pointer transition-all duration-500 hover:bg-white/80 ${currentSlide === idx ? "w-12 bg-white" : "w-8 bg-white/30"}`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
