import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/configs/api";

export interface TagItem {
    _id: string;
    name: string;
    isDeleted: boolean;
    appIds: string[];
    createdAt?: string;
    updatedAt?: string;
}

export function useTags(page: number = 1, limit: number = 20, search: string = "") {
    return useQuery({
        queryKey: ["tags", page, limit, search],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/api/v1/tags`, {
                params: { page, limit, search }
            });
            return response.data;
        },
    });
}

export function useCreateTag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { name: string }) => {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/api/v1/tags`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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
        mutationFn: async ({ id, data }: { id: string; data: { name: string } }) => {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/api/v1/tags/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/api/v1/tags/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
    });
}
