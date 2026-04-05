export interface DealItem {
  id: string;
  title: string;
  developer: string;
  rating: number;
  originalPrice: number; // in VND
  discountPrice: number; // in VND
  discountPercentage: number;
  image: string;
  type: "game" | "app";
  category: string;
  endDate?: string;
  isFeatured?: boolean;
}

export const featuredDeal: DealItem = {
  id: "deal-feat-1",
  title: "Cyberpunk 2077: Phantom Liberty Bundle",
  developer: "CD PROJEKT RED",
  rating: 4.8,
  originalPrice: 1250000,
  discountPrice: 625000,
  discountPercentage: 50,
  image:
    "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=1200&auto=format&fit=crop",
  type: "game",
  category: "Action RPG",
  endDate: "2026-05-01T00:00:00Z",
  isFeatured: true,
};

export const dealsData: DealItem[] = [
  {
    id: "d1",
    title: "The Witcher 3: Wild Hunt - Complete Edition",
    developer: "CD PROJEKT RED",
    rating: 4.9,
    originalPrice: 800000,
    discountPrice: 200000,
    discountPercentage: 75,
    image:
      "https://images.unsplash.com/photo-1579705745494-b223c6f2aebc?q=80&w=500&auto=format&fit=crop",
    type: "game",
    category: "RPG",
  },
  {
    id: "d3",
    title: "Red Dead Redemption 2",
    developer: "Rockstar Games",
    rating: 4.8,
    originalPrice: 1000000,
    discountPrice: 330000,
    discountPercentage: 67,
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=500&auto=format&fit=crop",
    type: "game",
    category: "Action/Adventure",
  },
  {
    id: "d4",
    title: "Grand Theft Auto V: Premium Edition",
    developer: "Rockstar Games",
    rating: 4.7,
    originalPrice: 500000,
    discountPrice: 200000,
    discountPercentage: 60,
    image:
      "https://images.unsplash.com/photo-1605901302636-fcfbd7fe3f50?q=80&w=500&auto=format&fit=crop",
    type: "game",
    category: "Action",
  },
  {
    id: "d5",
    title: "Adobe Creative Cloud Photography Plan",
    developer: "Adobe Inc.",
    rating: 4.5,
    originalPrice: 300000,
    discountPrice: 150000,
    discountPercentage: 50,
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=500&auto=format&fit=crop",
    type: "app",
    category: "Photography",
  },
  {
    id: "d6",
    title: "Microsoft 365 Personal",
    developer: "Microsoft Corporation",
    rating: 4.6,
    originalPrice: 1300000,
    discountPrice: 910000,
    discountPercentage: 30,
    image:
      "https://images.unsplash.com/photo-1633419461186-7d40a38b556b?q=80&w=500&auto=format&fit=crop",
    type: "app",
    category: "Productivity",
  },
  {
    id: "d7",
    title: "God of War",
    developer: "PlayStation PC LLC",
    rating: 4.9,
    originalPrice: 1150000,
    discountPrice: 575000,
    discountPercentage: 50,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500&auto=format&fit=crop",
    type: "game",
    category: "Action",
  },
  {
    id: "d8",
    title: "Spotify Premium",
    developer: "Spotify AB",
    rating: 4.8,
    originalPrice: 590000,
    discountPrice: 295000,
    discountPercentage: 50,
    image:
      "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=500&auto=format&fit=crop",
    type: "app",
    category: "Music",
  },
  {
    id: "d9",
    title: "Stardew Valley",
    developer: "ConcernedApe",
    rating: 4.9,
    originalPrice: 165000,
    discountPrice: 99000,
    discountPercentage: 40,
    image:
      "https://images.unsplash.com/photo-1592839719941-8e2651039d01?q=80&w=500&auto=format&fit=crop",
    type: "game",
    category: "Farming Sim",
  },
  {
    id: "d10",
    title: "Notion Plus",
    developer: "Notion Labs, Inc.",
    rating: 4.8,
    originalPrice: 1200000,
    discountPrice: 840000,
    discountPercentage: 30,
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=500&auto=format&fit=crop",
    type: "app",
    category: "Productivity",
  },
];
