import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/configs/api";

export interface DeveloperPermissions {
  canPublishApp: boolean;
  canEditOwnApps: boolean;
  canDeleteOwnApps: boolean;
  canViewAnalytics: boolean;
  canManagePricing: boolean;
  canRespondReviews: boolean;
}

export interface DeveloperStats {
  totalApps: number;
  publishedApps: number;
  totalDownloads: number;
  avgRating: number;
}

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
  status: "pending" | "approved" | "rejected";
  rejectionReason: string;
  permissions: DeveloperPermissions;
  contactEmail: string;
  socialLinks: Record<string, string>;
  stats: DeveloperStats;
  approvedBy?: { _id: string; fullName?: string; email?: string } | null;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useDevelopers(
  page: number = 1,
  limit: number = 20,
  sortBy: string = "createdAt",
  order: number = -1,
  status?: string,
) {
  return useQuery({
    queryKey: ["developers", page, limit, sortBy, order, status],
    queryFn: async () => {
      const params: any = { page, limit, sortBy, order };
      if (status) params.status = status;
      const response = await axios.get(`${API_URL}/api/v1/developers`, {
        params,
      });
      return response.data?.data || response.data;
    },
  });
}

export function useMyDeveloper() {
  return useQuery({
    queryKey: ["developers", "me"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/v1/developers/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return (response.data?.data || response.data) as DeveloperItem | null;
    },
  });
}

export function useMyApps() {
  return useQuery({
    queryKey: ["developers", "my-apps"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/v1/developers/my/apps`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data?.data || response.data;
    },
  });
}

export function useCreateDeveloper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<DeveloperItem>) => {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/api/v1/developers`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["developers"] }),
  });
}

export function useUpdateDeveloper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<DeveloperItem>;
    }) => {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/v1/developers/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["developers"] }),
  });
}

export function useRevokeDeveloper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/v1/developers/${id}/revoke`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["developers"] }),
  });
}

// ===== Admin-only mutations =====

export function useApproveDeveloper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      permissions,
    }: {
      id: string;
      permissions?: Partial<DeveloperPermissions>;
    }) => {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/v1/developers/${id}/approve`,
        { permissions },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["developers"] }),
  });
}

export function useRejectDeveloper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/v1/developers/${id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["developers"] }),
  });
}

export function useUpdateDeveloperPermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      permissions,
    }: {
      id: string;
      permissions: Partial<DeveloperPermissions>;
    }) => {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/v1/developers/${id}/permissions`,
        { permissions },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["developers"] }),
  });
}
