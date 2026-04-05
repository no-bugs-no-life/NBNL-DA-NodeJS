import api from "@/lib/axios";
import { FileItem } from "@/hooks/useFiles";

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

export interface FetchFilesParams {
  page?: number;
  limit?: number;
  ownerType?: string;
  fileType?: string;
}

export const fetchFiles = async (
  params: FetchFilesParams = {},
): Promise<PaginatedResult<FileItem>> => {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  const res = await api.get(`/api/v1/files?${qs}`);
  return res.data;
};

export const getFile = async (id: string): Promise<FileItem> => {
  const res = await api.get(`/api/v1/files/${id}`);
  return res.data;
};

export const updateFile = async (
  id: string,
  data: { fileType?: string; url?: string },
) => {
  const res = await api.put(`/api/v1/files/${id}`, data);
  return res.data;
};

export const deleteFile = async (id: string) => {
  const res = await api.delete(`/api/v1/files/${id}`);
  return res.data;
};

export const uploadFile = async (formData: FormData) => {
  const res = await api.post(`/api/v1/files/upload-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const createFile = async (data: {
  ownerType: string;
  ownerId?: string;
  fileType: string;
  url: string;
}) => {
  const res = await api.post(`/api/v1/files/create`, data);
  return res.data;
};
