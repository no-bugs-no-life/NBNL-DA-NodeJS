import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface AdminAppItem {
  _id: string;
  name: string;
  iconUrl?: string;
}

export function useAdminApps() {
  return useQuery<AdminAppItem[]>({
    queryKey: ["admin-apps-select"],
    queryFn: async () => {
      const res = await api.get("/api/v1/apps/admin?page=1&limit=1000");
      const data = res.data;
      return Array.isArray(data) ? data : data?.docs || [];
    },
  });
}
