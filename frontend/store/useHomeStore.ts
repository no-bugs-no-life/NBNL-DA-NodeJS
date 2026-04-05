import { create } from "zustand";

export interface AppItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    status: string;
    tags?: string[];
}

export interface ProductItem {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images?: string[];
    tags?: string[];
}

export interface CategoryItem {
    _id: string;
    name: string;
    iconUrl: string;
    parentId?: string | null;
}

export interface HomeStoreState {
    trendingApps: AppItem[];
    bestSellingGames: ProductItem[];
    collections: CategoryItem[];
    productivityApps: AppItem[];
    isLoading: boolean;
    setHomeData: (data: Partial<HomeStoreState>) => void;
}

export const useHomeStore = create<HomeStoreState>((set) => ({
    trendingApps: [],
    bestSellingGames: [],
    collections: [],
    productivityApps: [],
    isLoading: true,
    setHomeData: (data) => set((state) => ({ ...state, ...data })),
}));
