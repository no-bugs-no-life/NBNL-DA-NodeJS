import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/configs/api";

export interface DeveloperItem {
    _id: string;
    userId: {
        _id: string;
        fullName?: string;
        email?: string;
        avatarUrl?: string;
    };
    name: string;
    bio: string;
    website: string;
    avatarUrl: string;
    apps: any[];
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export function useDevelopers(page: number = 1, limit: number = 20, sortBy: string = "createdAt", order: number = -1) {
    return useQuery({
        queryKey: ["developers", page, limit, sortBy, order],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/api/v1/developers`, {
                params: { page, limit, sortBy, order }
            });
            return response.data;
        },
    });
}

export function useUpdateDeveloper() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<DeveloperItem> }) => {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/api/v1/developers/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developers"] });
        },
    });
}

export function useDeleteDeveloper() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/api/v1/developers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developers"] });
        },
    });
}
