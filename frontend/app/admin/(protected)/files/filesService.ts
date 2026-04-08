import { FileItem } from "@/hooks/useFiles";
import { uploadFileByChunks } from "@/lib/chunkUpload";
import api from "@/lib/axios";

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
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Thiếu file upload");
  }
  const fileType = String(formData.get("fileType") || "other");
  const ownerType = String(formData.get("ownerType") || "app");
  const ownerId = String(formData.get("ownerId") || "unknown");
  return uploadFileByChunks({ file, fileType, ownerType, ownerId });
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
