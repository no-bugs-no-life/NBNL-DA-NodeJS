import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { DealItem } from "./data";

export default function DealHero({ featuredDeal }: { featuredDeal: DealItem }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container-highest group">
      <div className="absolute inset-0">
        <Image
          src={featuredDeal.image}
          alt={featuredDeal.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/35 md:to-transparent" />
      </div>

      <div className="relative z-10 w-full md:w-2/3 lg:w-1/2 p-6 md:p-10 lg:p-12 flex flex-col justify-end md:justify-center min-h-[320px] md:min-h-[420px]">
        <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-fixed border border-primary/30 px-3 py-1.5 rounded-full text-sm font-medium w-fit mb-4 backdrop-blur-sm">
          <Clock className="w-4 h-4" />
          <span>Ưu đãi nổi bật</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
          {featuredDeal.title}
        </h1>

        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-3">
            <span className="bg-primary text-white font-bold px-2 py-1 rounded text-base">
              -{featuredDeal.discountPercentage}%
            </span>
            <span className="text-2xl font-bold text-white">
              ${featuredDeal.discountPrice.toFixed(2)}
            </span>
          </div>
          <span className="text-white/70 line-through text-sm">
            Giá gốc: ${featuredDeal.originalPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/apps/${featuredDeal.slug}`}
            className="flex items-center gap-2 bg-white text-black hover:bg-slate-200 px-6 py-3 rounded-full font-semibold transition-colors w-full sm:w-auto justify-center"
          >
            Mua ngay
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/apps"
            className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-full font-semibold transition-colors border border-white/20 w-full sm:w-auto justify-center"
          >
            Xem thêm
          </Link>
        </div>
      </div>
    </div>
  );
}
