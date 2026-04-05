import axios from "axios";
import { API_URL } from "@/configs/api";

const getHeaders = (token: string | null) => (token ? { Authorization: `Bearer ${token}` } : {});

export interface AppItem {
    _id: string;
    name: string;
    slug: string;
    iconUrl?: string;
    price: number;
    status: string;
    developerId: { _id: string; fullName: string; email: string; avatarUrl?: string };
    categoryId: { _id: string; name: string };
    createdAt: string;
}

export interface PaginatedResult<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
}

export const fetchApps = async (page = 1, limit = 20, isPending = false, token: string | null): Promise<PaginatedResult<AppItem>> => {
    const endpoint = isPending ? '/api/v1/apps/pending' : '/api/v1/apps';
    const res = await axios.get(`${API_URL}${endpoint}?page=${page}&limit=${limit}`, { headers: getHeaders(token) });
    return res.data;
};

export const approveApp = async (id: string, token: string | null) => {
    const res = await axios.post(`${API_URL}/api/v1/apps/approve/${id}`, {}, { headers: getHeaders(token) });
    return res.data;
};

export const rejectApp = async (id: string, token: string | null) => {
    const res = await axios.post(`${API_URL}/api/v1/apps/reject/${id}`, {}, { headers: getHeaders(token) });
    return res.data;
};

export const deleteApp = async (id: string, token: string | null) => {
    const res = await axios.delete(`${API_URL}/api/v1/apps/${id}`, { headers: getHeaders(token) });
    return res.data;
};

export interface AppInput {
    name: string;
    description?: string;
    slug: string;
    price: number;
    categoryId: string;
    iconUrl?: string;
}

export const createApp = async (data: AppInput, token: string | null) => {
    const res = await axios.post(`${API_URL}/api/v1/apps`, data, { headers: getHeaders(token) });
    return res.data;
};

export const updateApp = async (id: string, data: AppInput, token: string | null) => {
    const res = await axios.put(`${API_URL}/api/v1/apps/${id}`, data, { headers: getHeaders(token) });
    return res.data;
};
