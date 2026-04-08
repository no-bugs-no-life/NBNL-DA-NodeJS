import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

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
      const response = await api.get(`/api/v1/carts/my`);
      return (response.data?.data || response.data) as CartItem | null;
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
      const response = await api.post(`/api/v1/carts/my/items`, {
        app: data.appId,
        itemType: data.itemType,
        plan: data.plan,
        quantity: data.quantity,
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
      const response = await api.put(`/api/v1/carts/my/items/${appId}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appId: string) => {
      const response = await api.delete(`/api/v1/carts/my/items/${appId}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/api/v1/carts/my`);
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
      const response = await api.get(`/api/v1/carts`, {
        params: { page, limit },
      });
      return response.data?.data || response.data;
    },
  });
}

export function useDeleteCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/v1/carts/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "carts"] });
    },
  });
}
