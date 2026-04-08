import axios from "axios";
import { CategoryItem } from "@/hooks/useCategories";
import { API_URL } from "@/configs/api";

const getHeaders = (token: string | null) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

export const fetchCategories = async (
  page = 1,
  limit = 20,
): Promise<PaginatedResult<CategoryItem>> => {
  const res = await axios.get(
    `${API_URL}/api/v1/categories?page=${page}&limit=${limit}`,
  );
  return res.data?.data || res.data;
};

export const createCategory = async (
  data: { name: string; iconUrl?: string },
  token: string | null,
) => {
  const res = await axios.post(`${API_URL}/api/v1/categories`, data, {
    headers: getHeaders(token),
  });
  return res.data;
};

export const updateCategory = async (
  id: string,
  data: { name: string; iconUrl?: string },
  token: string | null,
) => {
  const res = await axios.put(`${API_URL}/api/v1/categories/${id}`, data, {
    headers: getHeaders(token),
  });
  return res.data;
};

export const deleteCategory = async (id: string, token: string | null) => {
  const res = await axios.delete(`${API_URL}/api/v1/categories/${id}`, {
    headers: getHeaders(token),
  });
  return res.data;
};
