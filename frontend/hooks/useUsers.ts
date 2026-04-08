import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User } from "@/store/useAuthStore";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/api/v1/users?page=1&limit=1000");
      const payload = res.data?.data || res.data;
      return Array.isArray(payload) ? payload : (payload?.items || payload?.docs || []);
    },
  });
}
