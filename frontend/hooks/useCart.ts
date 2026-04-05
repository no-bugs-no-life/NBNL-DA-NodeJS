import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/configs/api";

export interface CartAppItem {
  _id: string;
  name: string;
  iconUrl: string;
  price: number;
  subscriptionPrice?: number;
}

export interface CartItemData {
  _id: string;
  appId: CartAppItem;
  itemType: "one_time" | "subscription";
  plan?: "monthly" | "yearly" | null;
  quantity: number;
  priceAtAdd: number;
}

export interface CartItem {
  _id: string;
  user: {
    _id: string;
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  };
  items: CartItemData[];
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

// ===== User Cart =====

export function useMyCart() {
  return useQuery({
    queryKey: ["cart", "me"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/v1/carts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as CartItem | null;
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      appId: string;
      itemType?: string;
      plan?: string;
      quantity?: number;
    }) => {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/api/v1/carts/items`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      appId,
      data,
    }: {
      appId: string;
      data: { quantity?: number; plan?: string };
    }) => {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/v1/carts/items/${appId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appId: string) => {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/api/v1/carts/items/${appId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/api/v1/carts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

// ===== Admin Cart Management =====

export function useAdminCarts(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["admin", "carts", page, limit],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/v1/carts/all`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });
}

export function useDeleteCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/api/v1/carts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "carts"] });
    },
  });
}
