import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { API_URL } from "@/configs/api";

export interface CategoryItem {
  _id: string;
  name: string;
  iconUrl: string;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

export function useCategories() {
  return useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get(`/api/v1/categories?limit=100`);
      const docs = response.data?.data?.docs || [];
      return docs.map((cat: CategoryItem) => ({
        ...cat,
        iconUrl:
          cat.iconUrl && !cat.iconUrl.startsWith("http")
            ? `${API_URL}/${cat.iconUrl.replace(/\\/g, "/")}`
            : cat.iconUrl,
      }));
    },
  });
}
