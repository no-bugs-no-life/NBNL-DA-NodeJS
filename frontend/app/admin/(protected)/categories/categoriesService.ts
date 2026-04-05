import axios from "axios";
import { CategoryItem } from "@/hooks/useCategories";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getHeaders = (token: string | null) => (token ? { Authorization: `Bearer ${token}` } : {});

export const fetchCategories = async (): Promise<CategoryItem[]> => {
    const res = await axios.get(`${API_URL}/api/v1/categories`);
    return res.data;
};

export const createCategory = async (data: { name: string; iconUrl?: string }, token: string | null) => {
    const res = await axios.post(`${API_URL}/api/v1/categories`, data, { headers: getHeaders(token) });
    return res.data;
};

export const updateCategory = async (id: string, data: { name: string; iconUrl?: string }, token: string | null) => {
    const res = await axios.put(`${API_URL}/api/v1/categories/${id}`, data, { headers: getHeaders(token) });
    return res.data;
};

export const deleteCategory = async (id: string, token: string | null) => {
    const res = await axios.delete(`${API_URL}/api/v1/categories/${id}`, { headers: getHeaders(token) });
    return res.data;
};
