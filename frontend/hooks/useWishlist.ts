import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/store/useAuthStore";

export interface WishlistAppItem {
  _id: string;
  name: string;
  iconUrl: string;
  price: number;
  subscriptionPrice?: number;
  status?: string;
  developerId?: { name?: string };
}

export interface WishlistItem {
  _id: string;
  user?: {
    _id: string;
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  };
  userId?: {
    _id: string;
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  };
  apps?: WishlistAppItem[];
  appIds?: WishlistAppItem[];
  createdAt?: string;
  updatedAt?: string;
}

// ===== My Wishlist (User) =====

export function useMyWishlist() {
  return useQuery({
    queryKey: ["wishlist", "me"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/wishlists/my");
      return (response.data?.data ?? response.data ?? null) as WishlistItem | null;
    },
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appId: string) => {
      const response = await apiClient.post("/api/v1/wishlists/my/apps", {
        app: appId,
      });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appId: string) => {
      const response = await apiClient.delete(`/api/v1/wishlists/my/apps/${appId}`);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useClearWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete("/api/v1/wishlists/my");
      return response.data?.data ?? response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

// ===== Admin Wishlist Management =====

export function useAdminWishlists(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["admin", "wishlists", page, limit],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/wishlists", {
        params: { page, limit },
      });
      return response.data?.data ?? response.data;
    },
  });
}

export function useDeleteWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/api/v1/wishlists/${id}`);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "wishlists"] });
    },
  });
}

export function useCreateWishlistAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { userId: string; appIds: string[] }) => {
      const response = await apiClient.post("/api/v1/wishlists", {
        user: data.userId,
        apps: data.appIds,
      });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "wishlists"] });
    },
  });
}

export function useUpdateWishlistAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { userId?: string; appIds?: string[] };
    }) => {
      const response = await apiClient.put(`/api/v1/wishlists/${id}`, {
        ...(data.userId ? { user: data.userId } : {}),
        ...(data.appIds ? { apps: data.appIds } : {}),
      });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "wishlists"] });
    },
  });
}
