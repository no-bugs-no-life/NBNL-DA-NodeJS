import api from "@/lib/axios";

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

export interface SubscriptionItem {
  _id: string;
  userId: { _id: string; fullName: string; email: string; avatarUrl?: string };
  appId: { _id: string; name: string; iconUrl?: string };
  packageId: {
    _id: string;
    name: string;
    type: "monthly" | "yearly" | "lifetime";
    price: number;
    durationDays: number;
  };
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "cancelled";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FetchSubscriptionsParams {
  page?: number;
  limit?: number;
  userId?: string;
  appId?: string;
  status?: string;
}

export const fetchSubscriptions = async (
  params: FetchSubscriptionsParams = {},
): Promise<PaginatedResult<SubscriptionItem>> => {
  const cleanParams: Record<string, string> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      cleanParams[k] = String(v);
    }
  });
  const qs = new URLSearchParams(cleanParams).toString();
  const res = await api.get(`/api/v1/subscriptions?${qs}`);
  return res.data;
};

export const createSubscription = async (data: {
  userId: string;
  packageId: string;
}) => {
  const res = await api.post(`/api/v1/subscriptions`, data);
  return res.data;
};

export const renewSubscription = async (id: string, packageId: string) => {
  const res = await api.put(`/api/v1/subscriptions/${id}/renew`, { packageId });
  return res.data;
};

export const cancelSubscription = async (id: string) => {
  const res = await api.put(`/api/v1/subscriptions/${id}/cancel`, {});
  return res.data;
};

export const deleteSubscription = async (id: string) => {
  const res = await api.delete(`/api/v1/subscriptions/${id}`);
  return res.data;
};
