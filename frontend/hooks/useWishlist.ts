import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/configs/api";

export interface WishlistAppItem {
  _id: string;
  name: string;
  iconUrl: string;
  price: number;
  subscriptionPrice?: number;
  status?: string;
  developerId?: { fullName?: string };
}

export interface WishlistItem {
  _id: string;
  userId: {
    _id: string;
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  };
  appIds: WishlistAppItem[];
  createdAt?: string;
  updatedAt?: string;
}

// ===== My Wishlist (User) =====

export function useMyWishlist() {
  return useQuery({
    queryKey: ["wishlist", "me"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/v1/wishlists`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as WishlistItem | null;
    },
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appId: string) => {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/v1/wishlists`,
        { appId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appId: string) => {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/api/v1/wishlists/${appId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useClearWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/api/v1/wishlists`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

// ===== Admin Wishlist Management =====

export function useAdminWishlists(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["admin", "wishlists", page, limit],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/v1/wishlists/all`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });
}

export function useDeleteWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/api/v1/wishlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
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
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/v1/wishlists/admin`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "wishlists"] });
    },
  });
}
