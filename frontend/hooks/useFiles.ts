import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/configs/api";

export interface FileItem {
  _id: string;
  ownerType: "app" | "user" | "developer";
  ownerId: string;
  fileType:
    | "apk"
    | "ipa"
    | "icon"
    | "banner"
    | "screenshot"
    | "avatar"
    | "other";
  url: string;
  size: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useFiles(params?: {
  ownerType?: string;
  ownerId?: string;
  fileType?: string;
}) {
  const queryStr = new URLSearchParams(
    params as Record<string, string>,
  ).toString();
  return useQuery<FileItem[]>({
    queryKey: ["files", params],
    queryFn: async () => {
      const response = await axios.get<any>(
        `${API_URL}/api/v1/files?${queryStr}`,
      );
      return response.data?.docs || response.data || [];
    },
  });
}
