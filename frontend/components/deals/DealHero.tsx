import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { featuredDeal } from "./data";

export default function DealHero() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 group">
      <div className="absolute inset-0">
        <Image
          src={featuredDeal.image}
          alt={featuredDeal.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent md:bg-gradient-to-r md:from-slate-950 md:via-slate-900/90 md:to-transparent" />
      </div>

      <div className="relative z-10 w-full md:w-2/3 lg:w-1/2 p-6 md:p-12 lg:p-16 flex flex-col justify-end md:justify-center min-h-[400px] md:min-h-[500px]">
        <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full text-sm font-medium w-fit mb-4 backdrop-blur-sm">
          <Clock className="w-4 h-4" />
          <span>Ưu đãi nổi bật</span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {featuredDeal.title}
        </h1>

        <div className="flex flex-col gap-1 mb-8">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white font-bold px-2 py-1 rounded text-lg">
              -{featuredDeal.discountPercentage}%
            </span>
            <span className="text-2xl font-bold text-white">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(featuredDeal.discountPrice)}
            </span>
          </div>
          <span className="text-slate-400 line-through text-sm">
            Giá gốc:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(featuredDeal.originalPrice)}
          </span>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href={`/deals/${featuredDeal.id}`}
            className="flex items-center gap-2 bg-white text-black hover:bg-slate-200 px-6 py-3 rounded-full font-semibold transition-colors w-full sm:w-auto justify-center"
          >
            Mua Ngay
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-full font-semibold transition-colors border border-white/20 w-full sm:w-auto justify-center">
            Thêm vào Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
