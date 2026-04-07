import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
			const response = await axios.get<PaginatedResult<CategoryItem>>(
				`${API_URL}/api/v1/categories?limit=100`,
			);
			return response.data.docs || [];
		},
	});
}