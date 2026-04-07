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
      href={`/apps/${deal.slug}`}
      className="group flex flex-col bg-surface-container-low rounded-xl overflow-hidden hover:ring-2 hover:ring-primary/70 transition-all duration-300 h-full"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {deal.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            -{deal.discountPercentage}%
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-primary font-medium mb-1">{deal.category}</div>
        <h3 className="font-semibold text-on-surface line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {deal.title}
        </h3>

        <div className="text-xs text-on-surface-variant mb-2 truncate">
          {deal.developer}
        </div>

        <div className="flex items-center gap-1 mb-auto pb-2">
          <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-medium text-on-surface-variant">
            {deal.rating.toFixed(1)}
          </span>
        </div>

        <div className="pt-2 border-t border-outline-variant/20 flex flex-col items-start gap-1">
          <span className="text-xs text-on-surface-variant line-through">
            ${deal.originalPrice.toFixed(2)}
          </span>
          <span className="text-sm font-bold text-on-surface">
            ${deal.discountPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
