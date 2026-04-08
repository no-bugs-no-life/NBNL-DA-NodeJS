import api from "@/lib/axios";

export interface AppItem {
  _id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  price: number;
  status: string;
  developer: {
    _id: string;
    name: string;
    contactEmail: string;
    avatarUrl?: string;
  };
  category: { _id: string; name: string };
  tags?: { _id: string; name: string }[];
  ratingScore?: number;
  ratingCount?: number;
  createdAt: string;
  isDisabled?: boolean;
  isDeleted?: boolean;
}

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

export const fetchApps = async (
  page = 1,
  limit = 20,
  filterStatus = "published", // Default to published for backwards compatibility
  token: string | null,
): Promise<PaginatedResult<AppItem>> => {
  let endpoint = `/api/v1/apps?page=${page}&limit=${limit}`;

  // All queries use the same apps endpoint, but with auth token and filters
  if (filterStatus !== "published" || token) {
    endpoint = `/api/v1/apps?page=${page}&limit=${limit}`;

    if (filterStatus === "deleted") {
      endpoint += `&isDeleted=true`;
    } else if (filterStatus === "all") {
      // Do nothing, fetching all active
    } else {
      endpoint += `&status=${filterStatus}`;
    }
  }

  // token param kept for backwards compatibility (auth handled by axiosInstance)
  void token;
  const res = await api.get(endpoint);
  return res.data?.data || res.data;
};

export const fetchAppById = async (
  id: string,
  token: string | null,
): Promise<AppItem> => {
  void token;
  const res = await api.get(`/api/v1/apps/${id}`);
  return res.data?.data || res.data;
};

export const toggleDisableApp = async (id: string, token: string | null) => {
  void token;
  const res = await api.patch(`/api/v1/apps/${id}/disable`, {});
  return res.data;
};

export const approveApp = async (id: string, token: string | null) => {
  void token;
  const res = await api.post(`/api/v1/apps/approve/${id}`, {});
  return res.data;
};

export const publishApp = async (id: string, token: string | null) => {
  void token;
  const res = await api.post(`/api/v1/apps/publish/${id}`, {});
  return res.data;
};

export const rejectApp = async (id: string, token: string | null) => {
  void token;
  const res = await api.post(`/api/v1/apps/reject/${id}`, {});
  return res.data;
};

export const deleteApp = async (id: string, token: string | null) => {
  void token;
  const res = await api.delete(`/api/v1/apps/${id}`);
  return res.data;
};

export interface AppInput {
  name: string;
  description?: string;
  slug: string;
  price: number;
  category: string;
  tags?: string[];
  iconUrl?: string;
  developer: string;
}

export const createApp = async (data: AppInput, token: string | null) => {
  void token;
  const res = await api.post(`/api/v1/apps`, data);
  return res.data;
};

export const updateApp = async (
  id: string,
  data: AppInput,
  token: string | null,
) => {
  void token;
  const res = await api.put(`/api/v1/apps/${id}`, data);
  return res.data;
};
