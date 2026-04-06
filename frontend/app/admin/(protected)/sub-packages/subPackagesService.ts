import api from "@/lib/axios";

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

export interface SubPackageItem {
  _id: string;
  name: string;
  appId?: { _id: string; name: string; iconUrl?: string } | string;
  type: "monthly" | "yearly" | "lifetime";
  price: number;
  durationDays: number;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubPackageInput {
  name: string;
  appId: string;
  type: string;
  price: number;
  durationDays?: number;
  description?: string;
}

export interface UpdateSubPackageInput {
  name?: string;
  appId?: string;
  type?: string;
  price?: number;
  durationDays?: number;
  description?: string;
  isActive?: boolean;
}

export const fetchSubPackages = async (params: {
  page?: number;
  limit?: number;
  type?: string;
  isActive?: string;
} = {}): Promise<PaginatedResult<SubPackageItem>> => {
  const cleanParams: Record<string, string> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      cleanParams[k] = String(v);
    }
  });
  const qs = new URLSearchParams(cleanParams).toString();
  const res = await api.get(`/api/v1/sub-packages?${qs}`);
  return res.data;
};

export const createSubPackage = async (data: CreateSubPackageInput) => {
  const res = await api.post("/api/v1/sub-packages", data);
  return res.data;
};

export const updateSubPackage = async (
  id: string,
  data: UpdateSubPackageInput,
) => {
  const res = await api.put(`/api/v1/sub-packages/${id}`, data);
  return res.data;
};

export const deleteSubPackage = async (id: string) => {
  const res = await api.delete(`/api/v1/sub-packages/${id}`);
  return res.data;
};
