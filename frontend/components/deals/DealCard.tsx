import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { DealItem } from "./data";

interface DealCardProps {
  deal: DealItem;
}

export default function DealCard({ deal }: DealCardProps) {
  return (
    <Link
      href={`/deals/${deal.id}`}
      className="group flex flex-col bg-slate-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all duration-300 h-full"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-800">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {deal.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{deal.discountPercentage}%
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-blue-400 font-medium mb-1">
          {deal.category}
        </div>
        <h3 className="font-semibold text-white line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">
          {deal.title}
        </h3>

        <div className="text-xs text-slate-400 mb-2 truncate">
          {deal.developer}
        </div>

        <div className="flex items-center gap-1 mb-auto pb-2">
          <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-medium text-slate-300">
            {deal.rating}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800 flex flex-col items-start gap-1">
          <span className="text-xs text-slate-500 line-through">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(deal.originalPrice)}
          </span>
          <span className="text-sm font-bold text-white">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(deal.discountPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}
