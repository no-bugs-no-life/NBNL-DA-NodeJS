import { create } from "zustand";

export interface AppDetailData {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    developerId?: { fullName: string; email: string; avatarUrl: string };
    categoryId?: { name: string };
    iconUrl?: string;
    version?: string;
    status?: string;
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
