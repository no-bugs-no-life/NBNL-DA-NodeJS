import { create } from "zustand";

export interface AppDetailData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  developerId?: {
    name: string;
    contactEmail: string;
    avatarUrl: string;
    userId?: string;
  };
  categoryId?: { name: string };
  iconUrl?: string;
  version?: string;
  status?: string;
  screenshots?: string[];
  ratingScore?: number;
  ratingCount?: number;
  size?: string;
  platforms?: string[];
  tags?: string[];
  systemRequirements?: {
    min?: { os: string; cpu: string; ram: string; graphics: string };
    recommended?: { os: string; cpu: string; ram: string; graphics: string };
  };
  features?: { icon: string; desc: string }[];
  languageSupportCount?: number;
  securityVerified?: boolean;
  inAppPurchases?: boolean;
  reviews?: {
    userId?: { fullName?: string; email?: string; avatarUrl?: string };
    rating?: number;
    comment?: string;
    createdAt?: string;
  }[];
}

interface AppDetailStoreState {
  appInfo: AppDetailData | null;
  isLoading: boolean;
  setAppInfo: (app: AppDetailData) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAppDetailStore = create<AppDetailStoreState>((set) => ({
  appInfo: null,
  isLoading: true,
  setAppInfo: (appInfo) => set({ appInfo }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
