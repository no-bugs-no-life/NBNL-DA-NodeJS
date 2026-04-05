import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User } from "@/store/useAuthStore";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/users");
      return data;
    },
  });
}
