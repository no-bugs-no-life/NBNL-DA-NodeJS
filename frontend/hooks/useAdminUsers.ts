import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/store/useAuthStore";

export interface AdminUserItem {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export function useAdminUsers() {
  return useQuery<AdminUserItem[]>({
    queryKey: ["admin-users-select"],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/users?page=1&limit=1000`);
      const payload = res.data?.data || res.data;
      return Array.isArray(payload) ? payload : (payload?.items || payload?.docs || []);
    },
  });
}
