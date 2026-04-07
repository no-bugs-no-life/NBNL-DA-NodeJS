import api from "@/lib/axios";

export type VersionStatus = "draft" | "published" | "deprecated" | "archived";
export type VersionPlatform =
  | "android"
  | "ios"
  | "windows"
  | "macos"
  | "linux"
  | "web";

export interface AppVersion {
  _id: string;
  app: string;
  versionNumber: string;
  versionCode: number;
  releaseName?: string;
  changelog?: string;
  status: VersionStatus;
  isLatest: boolean;
  files: {
    platform: VersionPlatform;
    fileKey: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }[];
  downloadCount: number;
  createdAt: string;
}

export interface CreateAppVersionInput {
  app: string;
  versionNumber: string;
  versionCode: number;
  releaseName?: string;
  changelog?: string;
  files: {
    platform: VersionPlatform;
    fileKey: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }[];
  status?: VersionStatus;
  isLatest?: boolean;
}

export async function fetchVersionsByApp(appId: string): Promise<AppVersion[]> {
  const res = await api.get(`/api/v1/versions/app/${appId}`);
  return (res.data?.data || res.data || []) as AppVersion[];
}

export async function createVersion(input: CreateAppVersionInput) {
  const res = await api.post("/api/v1/versions", input);
  return res.data?.data || res.data;
}

export async function publishVersion(id: string) {
  const res = await api.patch(`/api/v1/versions/${id}/publish`);
  return res.data?.data || res.data;
}

export async function revokeDownloadVersion(id: string) {
  const res = await api.patch(`/api/v1/versions/${id}/revoke-download`);
  return res.data?.data || res.data;
}
