import api from "@/lib/axios";

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

export interface CouponItem {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  appIds: Array<{ _id: string; name: string; iconUrl?: string }>;
  createdAt: string;
}

export interface CreateCouponInput {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  appIds?: string[];
}

export interface UpdateCouponInput {
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  appIds?: string[];
}

export const fetchCoupons = async (
  page = 1,
  limit = 10,
): Promise<PaginatedResult<CouponItem>> => {
  const res = await api.get(`/api/v1/coupons?page=${page}&limit=${limit}`);
  return res.data;
};

export const createCoupon = async (data: CreateCouponInput) => {
  const res = await api.post(`/api/v1/coupons`, data);
  return res.data;
};

export const updateCoupon = async (id: string, data: UpdateCouponInput) => {
  const res = await api.put(`/api/v1/coupons/${id}`, data);
  return res.data;
};

export const deleteCoupon = async (id: string) => {
  const res = await api.delete(`/api/v1/coupons/${id}`);
  return res.data;
};
