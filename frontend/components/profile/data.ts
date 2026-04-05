export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  joinDate: string;
  avatarUrl: string;
  coverUrl: string;
  level: number;
  xp: number;
  maxXp: number;
  bio: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  image: string;
  playTime: number; // in hours
  lastPlayed: string;
  type: "game" | "app";
}

export const mockUser: UserProfile = {
  id: "u_1",
  username: "horizon_gamer",
  email: "hello@horizon-store.com",
  displayName: "Nghia Trung",
  joinDate: "2023-10-15T00:00:00Z",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuATmrxYA52dli6iSqeFTy7F1qW-2DVZkF5AFAI7DrbRvJF6dxFe--SldncN0spBWln2U540bp4_gOJ2CJ93abVKmOfW-8Jo6fJa-GToYMWkHT1dIR01k9oE0dkbpM2zfigQpjfBY17fuZdzEyjgfpIHNPPRASMLkv70OApkI8bWReMHnmNGlJVeSYJMLNBB28duShTpcCa_qmclTgSiIy9bcQgn9chwN5lefFfQlbiXqj6TDEk0SCmISnIXjwZisKLp1IQzp3zYQBE",
  coverUrl:
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop",
  level: 15,
  xp: 3450,
  maxXp: 5000,
  bio: "Hardcore gamer & Developer. I love building things and playing Cyberpunk 2077 in my free time.",
};

export const mockLibrary: LibraryItem[] = [
  {
    id: "g1",
    title: "Cyberpunk 2077",
    image:
      "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=600&auto=format&fit=crop",
    playTime: 120.5,
    lastPlayed: "2024-04-01T14:30:00Z",
    type: "game",
  },
  {
    id: "g2",
    title: "Red Dead Redemption 2",
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop",
    playTime: 200,
    lastPlayed: "2024-03-15T09:00:00Z",
    type: "game",
  },
  {
    id: "g3",
    title: "The Witcher 3: Wild Hunt",
    image:
      "https://images.unsplash.com/photo-1579705745494-b223c6f2aebc?q=80&w=600&auto=format&fit=crop",
    playTime: 150.2,
    lastPlayed: "2023-12-20T20:15:00Z",
    type: "game",
  },
  {
    id: "a1",
    title: "Adobe Photoshop",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop",
    playTime: 55.4,
    lastPlayed: "2024-04-05T08:00:00Z",
    type: "app",
  },
];
