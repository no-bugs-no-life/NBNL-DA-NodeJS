export interface DealItem {
  id: string;
  slug: string;
  title: string;
  developer: string;
  rating: number;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  image: string;
  type: "game" | "app";
  category: string;
  isFeatured?: boolean;
}

export const fallbackDeals: DealItem[] = [
  {
    id: "fallback-1",
    slug: "demo-game-1",
    title: "Demo Game 1",
    developer: "APKBugs Studio",
    rating: 4.7,
    originalPrice: 19.99,
    discountPrice: 9.99,
    discountPercentage: 50,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    type: "game",
    category: "Game",
    isFeatured: true,
  },
  {
    id: "fallback-2",
    slug: "demo-app-premium",
    title: "Demo App Premium",
    developer: "APKBugs Team",
    rating: 4.6,
    originalPrice: 29.99,
    discountPrice: 17.99,
    discountPercentage: 40,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
    type: "app",
    category: "Productivity",
  },
];

const ensureNumber = (value: unknown, fallback = 0) => {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export function mapAppsToDeals(apps: any[]): DealItem[] {
  return apps
    .map((app: any, index) => {
      const basePrice = Math.max(
        ensureNumber(app?.price, 0),
        ensureNumber(app?.subscriptionPrice, 0),
      );

      if (basePrice <= 0) return null;

      const discountPercentage =
        ensureNumber(app?.priority, 0) > 0 ? 35 : index % 2 === 0 ? 30 : 20;

      const discountPrice = Number(
        (basePrice * ((100 - discountPercentage) / 100)).toFixed(2),
      );

      const image =
        app?.screenshots?.[0] ||
        app?.bannerUrl ||
        app?.iconUrl ||
        "https://images.unsplash.com/photo-1616588589676-62b3bd8b47e2?q=80&w=1200&auto=format&fit=crop";

      const categoryName =
        app?.categoryId?.name || app?.category?.name || app?.category || "Ứng dụng";

      return {
        id: app?._id || app?.id || `${index}`,
        slug: app?.slug || app?._id || `${index}`,
        title: app?.name || "Ứng dụng",
        developer:
          app?.developerId?.name || app?.developer?.name || app?.developer || "N/A",
        rating: ensureNumber(app?.ratingScore, 4.5),
        originalPrice: basePrice,
        discountPrice,
        discountPercentage,
        image,
        type:
          String(categoryName).toLowerCase().includes("game") ||
          String(app?.type || "").toLowerCase() === "game"
            ? "game"
            : "app",
        category: categoryName,
        isFeatured: index === 0,
      } satisfies DealItem;
    })
    .filter(Boolean) as DealItem[];
}
