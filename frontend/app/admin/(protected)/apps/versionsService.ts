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

function normalizeVersionsPayload(payload: unknown): AppVersion[] {
  if (Array.isArray(payload)) return payload as AppVersion[];
  if (!payload || typeof payload !== "object") return [];

  const p = payload as Record<string, unknown>;
  const candidates = [
    p.data,
    p.docs,
    p.items,
    p.results,
    (p.data as any)?.docs,
    (p.data as any)?.items,
    (p.data as any)?.results,
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) return c as AppVersion[];
  }

  return [];
}

export async function fetchVersionsByApp(appId: string): Promise<AppVersion[]> {
  const res = await api.get(`/api/v1/versions/app/${appId}`);
  return normalizeVersionsPayload(res.data);
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
