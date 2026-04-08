import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface TagItem {
  _id: string;
  name: string;
  isDeleted: boolean;
  appIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export function useTags(
  page: number = 1,
  limit: number = 20,
  search: string = "",
) {
  return useQuery({
    queryKey: ["tags", page, limit, search],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit };
      if (search.trim()) params.search = search.trim();
      const response = await api.get(`/api/v1/tags`, { params });
      return response.data?.data || response.data;
    },
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await api.post(`/api/v1/tags`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name: string };
    }) => {
      const response = await api.put(`/api/v1/tags/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/v1/tags/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}
