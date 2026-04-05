import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/configs/api";

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
      const response = await axios.get<any>(`${API_URL}/api/v1/categories`);
      return response.data?.docs || response.data;
    },
  });
}
