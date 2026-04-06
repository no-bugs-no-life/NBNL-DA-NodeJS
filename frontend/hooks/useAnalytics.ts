/**
 * API service + React Query hooks cho Analytics Admin module
 * Pattern giống hệt useAdminApps.ts
 */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import useAuthStore from "@/store/useAuthStore";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AnalyticsRecord {
  _id: string;
  appId: {
    _id: string;
    name: string;
    iconUrl?: string;
  };
  date: string;
  views: number;
  downloads: number;
  installs: number;
  activeUsers: number;
  ratingAverage: number;
  crashCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsSummary {
  appId: string;
  appName: string;
  totalViews: number;
  totalDownloads: number;
  totalInstalls: number;
  avgActiveUsers: number;
  avgRating: number;
  totalCrashes: number;
  recordCount: number;
}

export interface AnalyticsFilter {
  page?: number;
  limit?: number;
  appId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsUpdate {
  views?: number;
  downloads?: number;
  installs?: number;
  activeUsers?: number;
  ratingAverage?: number;
  crashCount?: number;
}

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
}

// ─── API functions ────────────────────────────────────────────────────────────

function buildQuery(filters: AnalyticsFilter): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.appId) params.set("appId", filters.appId);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
  return params.toString();
}

export async function fetchAnalyticsList(
  filters: AnalyticsFilter,
  token?: string | null,
): Promise<PaginatedResult<AnalyticsRecord>> {
  const query = buildQuery(filters);
  const res = await api.get(`/api/v1/analytics?${query}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}

export async function fetchAnalyticsSummary(
  appId: string,
  token?: string | null,
): Promise<AnalyticsSummary> {
  const res = await api.get(`/api/v1/analytics/summary/${appId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}

export async function fetchAnalyticsById(
  id: string,
  token?: string | null,
): Promise<AnalyticsRecord> {
  const res = await api.get(`/api/v1/analytics/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}

export async function updateAnalyticsRecord(
  id: string,
  data: AnalyticsUpdate,
  token?: string | null,
): Promise<AnalyticsRecord> {
  const res = await api.put(`/api/v1/analytics/${id}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}

export async function deleteAnalyticsRecord(
  id: string,
  token?: string | null,
): Promise<{ message: string }> {
  const res = await api.delete(`/api/v1/analytics/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}

// ─── React Query hook ────────────────────────────────────────────────────────

export function useAdminAnalytics() {
  const queryClient = useQueryClient();
  const { token, isAdmin, isLoading: isAuthLoading } = useAuthStore();

  // ── Filters & pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [appIdFilter, setAppIdFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ── Modal targets
  const [detailTarget, setDetailTarget] = useState<AnalyticsRecord | null>(
    null,
  );
  const [editTarget, setEditTarget] = useState<AnalyticsRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AnalyticsRecord | null>(
    null,
  );

  // ── Toast
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── List query
  const filters: AnalyticsFilter = {
    page,
    limit,
    appId: appIdFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };

  const { data: listData, isLoading } = useQuery({
    queryKey: ["admin-analytics", filters],
    queryFn: () => fetchAnalyticsList(filters, token),
  });

  const records: AnalyticsRecord[] = listData?.docs ?? [];
  const totalPages = listData?.totalPages ?? 1;
  const totalDocs = listData?.totalDocs ?? 0;

  // ── Summary query (when appId selected)
  const { data: summary } = useQuery({
    queryKey: ["admin-analytics-summary", appIdFilter],
    queryFn: () => fetchAnalyticsSummary(appIdFilter, token),
    enabled: !!appIdFilter,
  });

  // ── Detail query
  const { data: detailRecord } = useQuery({
    queryKey: ["admin-analytics-record", detailTarget?._id],
    queryFn: () => fetchAnalyticsById(detailTarget!._id, token),
    enabled: !!detailTarget?._id,
  });

  // ── Mutations
  const mUpdate = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AnalyticsUpdate }) =>
      updateAnalyticsRecord(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      setEditTarget(null);
      notify("Cập nhật thành công!", "success");
    },
    onError: () => notify("Lỗi khi cập nhật!", "error"),
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => deleteAnalyticsRecord(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      setDeleteTarget(null);
      notify("Xoá bản ghi thành công!", "success");
    },
    onError: () => notify("Lỗi khi xoá bản ghi!", "error"),
  });

  return {
    // Auth
    isAdmin,
    isAuthLoading,
    // State
    page,
    setPage,
    limit,
    appIdFilter,
    setAppIdFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    // Data
    records,
    isLoading,
    totalPages,
    totalDocs,
    summary,
    // Modal targets
    detailTarget,
    setDetailTarget,
    editTarget,
    setEditTarget,
    deleteTarget,
    setDeleteTarget,
    // Detail
    detailRecord,
    // Toast
    toast,
    // Mutations
    mUpdate,
    mDelete,
    // Reset filters helper
    clearFilters: () => {
      setAppIdFilter("");
      setStartDate("");
      setEndDate("");
      setPage(1);
    },
  };
}
