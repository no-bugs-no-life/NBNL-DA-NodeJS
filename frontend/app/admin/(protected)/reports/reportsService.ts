import api from "@/lib/axios";

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";
export type ReportTargetType = "app" | "review";

export interface ReportItem {
  _id: string;
  reporterId: {
    _id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
  targetType: ReportTargetType;
  targetId: any;
  reason: string;
  status: ReportStatus;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateReportInput {
  reason?: string;
  status?: ReportStatus;
  adminNote?: string;
}

export interface CreateReportInput {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
}

export const fetchReports = async (
  params: {
    page?: number;
    limit?: number;
    status?: ReportStatus;
    targetType?: ReportTargetType;
  } = {},
): Promise<PaginatedResult<ReportItem>> => {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  const res = await api.get(`/api/v1/reports?${qs}`);
  return res.data;
};

export const updateReportStatus = async (
  id: string,
  status: ReportStatus,
  adminNote?: string,
) => {
  const res = await api.put(`/api/v1/reports/${id}/status`, {
    status,
    adminNote,
  });
  return res.data;
};

export const deleteReport = async (id: string) => {
  const res = await api.delete(`/api/v1/reports/${id}`);
  return res.data;
};

export const createReport = async (data: CreateReportInput) => {
  const res = await api.post(`/api/v1/reports`, data);
  return res.data;
};
