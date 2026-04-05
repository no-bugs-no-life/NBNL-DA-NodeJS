"use client";

import { useRef } from "react";
import { useAppDetailStore } from "../../store/useAppDetailStore";

export default function AppScreenshots() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { appInfo } = useAppDetailStore();

  const images =
    appInfo?.screenshots && appInfo.screenshots.length > 0
      ? appInfo.screenshots
      : [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCNs3wmb-h6j36TOpv5cWZAZERQObwgvbkHqBq8Eg2uep3aHl6Yuq68UTAcDihvMgvz9mIVhudx1G-1y3Bu-XPc4SIC7ozlnn_YR5ZZwl-JTZ1M8Mg1TQ0dXZjhD2_AJVewrxkXcCrsWVATzsWprcfLyvYKRCHsPMFpXEdzJmlSJJykUBVrAUwiM7gf0-J-VLQmeeXczj4mVcZPOmXBNP3nrgzYVVg0NhQ1mW2K8CKP1dUi8kERNYKYlgWXovnF_2LmXSeymIM88bs",
        ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Ảnh chụp màn hình</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="min-w-[500px] aspect-video rounded-xl overflow-hidden shadow-sm bg-white shrink-0"
          >
            <img
              alt={`Screen ${i}`}
              className="w-full h-full object-cover"
              src={src}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
