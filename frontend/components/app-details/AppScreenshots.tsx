"use client";

import { useRef } from "react";

export default function AppScreenshots() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCNs3wmb-h6j36TOpv5cWZAZERQObwgvbkHqBq8Eg2uep3aHl6Yuq68UTAcDihvMgvz9mIVhudx1G-1y3Bu-XPc4SIC7ozlnn_YR5ZZwl-JTZ1M8Mg1TQ0dXZjhD2_AJVewrxkXcCrsWVATzsWprcfLyvYKRCHsPMFpXEdzJmlSJJykUBVrAUwiM7gf0-J-VLQmeeXczj4mVcZPOmXBNP3nrgzYVVg0NhQ1mW2K8CKP1dUi8kERNYKYlgWXovnF_2LmXSeymIM88bs",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuANXc43beuF57_SwFgsXdNMI6g8-FTPi2G33mBzkPzi7Qp7pi-JxbJ2b0hvplOopvtRYYj0c28oU2u94sB9BLFz_MyS5wgPsnOnv5I52DpKQN0eZ2o60FiINicAxzcqDhIuW5iJGP5h8jlqU5-s6fjdI17vNcKCiQGFAkyNZBb5watkWSZ_30XSHzLx6FcjnSJD3xWhyB3kzZLc1CwgQrwWmjMDwb9KH0VGhcyyofYa2tEjdB3HvneubKq9gcBeEkFWhW9y8NA05BI",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDxZm6zvL1z4MqS4B1KuXlrJoUt_eadDAf1_Mgi7vsgt3ZNzCHOskJUXJ3DdzhLJRR_zancazLOTKXHjKLxoGpaOMpVnZ7jgsooQHyig0mA4-cMdh73G0RFXida-Kv4c2cedGsbpMtxZozd9_jYpstbrs0-cOC4QpTBn-2IdvO6E6wnFdVq2a6_S6EEOgjY0WxH4ufRKji3l04vLF71a4IYcD2HtP92jDxc9k8PGT9g7n9xgnapX_twpekV-Q5gkldNEyxEk7HRl_o",
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
