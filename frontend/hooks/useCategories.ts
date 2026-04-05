import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface CategoryItem {
  _id: string;
  name: string;
  iconUrl: string;
  parentId?: string | null;
}

export function useCategories() {
  return useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await axios.get<CategoryItem[]>(`${apiUrl}/api/v1/categories`);
      return response.data;
    },
  });
}
