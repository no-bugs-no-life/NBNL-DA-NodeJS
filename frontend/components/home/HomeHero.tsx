"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCvjgcGTThU-5hkonzGghyOtGc7x5MKa_AWqh-O42zfi2ol-cb5m1of9Bpu_WH_9aAIg2hXC7oVloI6jyEc7R_XGnkn6rRkPFxxThOMFFR1SU16NwM6Tr2nnfvFFNBAYBOIR0q2nM8dTArVJBU8QKalHEIxLO9yI9E3YYFdXF2_raBp4QaANIt1uIAhpIuC2Q-xVA97-GUauGmUrJlp0j7qtTZ2prSsV95DwGit3uTfCt2oFYQDsmfD3ufzrjhwAklWRXRac96VdGI",
      subtitle: "Featured Experience",
      title: "The Future of Creative Workflows",
      description:
        "Elevate your productivity with the all-new Luminous Suite. AI-powered tools designed for modern professionals.",
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDn-kgwJpwUToDuGIj9BfACQQ9Axe4DtmiywBpSNSwxZVhgE6wX0oINKJ9KhlYqZGhiFy4QleO8SEfmKNtrRteBtCQNCpr-N8SZ7L8Q-G_K16yy_NbITwBvYkgMHJzYt5fRKx2PZ1JF1Um_9ZQuoZEtDBRWRyxu-_WIPcj2WgQsSR07TdVQG3OijIyhuf3GdqJZzNAfOzu9eA1UHlkd75jlwm-cSqPChOMET_3m2avfRq4a_ZAWuoybClT61lmgUYbrBdd_9wZU1uY",
      subtitle: "Gaming Collection",
      title: "Discover Racing Essentials",
      description:
        "Experience top-rated simulation and racing action with incredible real-world physics and astonishing graphics.",
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBBnh_IuaV15FuqeJaYfDUJFXmhykPYxZhvsGXzLpOLbx00zXXfmfJlT8kfu5eswTmyXVTnZswdDy9jmZGLG2nLfVbE0j4Pjlhny4kZ1QJgRb0Ur32jcTLJ8H5Tg5kpoZ3j5fQZaDSU7cGdfSk4il1albHogf26ziSdk87wuGX_nR7VjuqCk3gdsNdCoDIly3RJ15zWHAgzPn0NZqq56vvnTUgFJDlnMZ5hp4WokpgORmMZyIWBA6h-1sdXFLc-mtbmKF9QXFASKlE",
      subtitle: "Customization",
      title: "Windows Themes Reimagined",
      description:
        "Personalize your entire desktop experience with high-quality themes built exclusively for you.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide];

  return (
    <section className="px-4 md:px-8 max-w-screen-2xl mx-auto mb-16 relative">
      <div className="relative w-full aspect-[4/5] sm:aspect-video lg:aspect-[21/9] rounded-xl overflow-hidden bg-surface-container-highest group">
        {/* Background images fade sequence */}
        {slides.map((slide, index) => (
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
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              href="/category"
              className="w-full sm:w-auto text-center hero-gradient text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 active:scale-95 shadow-lg shadow-primary/20"
            >
              Get started
            </Link>
            <Link
              href="/category"
              className="w-full sm:w-auto text-center bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all active:scale-95"
            >
              Learn more
            </Link>
          </div>
        </div>

        <div className="absolute bottom-4 right-1/2 translate-x-1/2 md:bottom-6 md:right-16 md:translate-x-0 flex gap-2 z-20">
          {slides.map((_, idx) => (
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
