import api from "@/lib/axios";

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

export interface ReviewApp {
  _id: string;
  name: string;
}

export interface ReviewUser {
  _id: string;
  fullName: string;
  email?: string;
  avatarUrl?: string;
}

export interface ReviewItem {
  _id: string;
  appId: ReviewApp;
  userId: ReviewUser;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface ReviewInput {
  appId: string;
  userId: string;
  rating: number;
  comment?: string;
  status?: "pending" | "approved" | "rejected";
}

export const fetchReviews = async (
  page = 1,
  limit = 20,
  isPending = false,
): Promise<PaginatedResult<ReviewItem>> => {
  const endpoint = isPending
    ? "/api/v1/reviews/pending"
    : "/api/v1/reviews/admin";
  const res = await api.get(`${endpoint}?page=${page}&limit=${limit}`);
  return res.data;
};

export const createReviewAdmin = async (data: ReviewInput) => {
  const res = await api.post(`/api/v1/reviews/admin`, data);
  return res.data;
};

export const updateReviewAdmin = async (
  id: string,
  data: Partial<ReviewInput>,
) => {
  const res = await api.put(`/api/v1/reviews/admin/${id}`, data);
  return res.data;
};

export const approveReview = async (id: string) => {
  const res = await api.post(`/api/v1/reviews/${id}/approve`, {});
  return res.data;
};

export const rejectReview = async (id: string) => {
  const res = await api.post(`/api/v1/reviews/${id}/reject`, {});
  return res.data;
};

export const deleteReview = async (id: string) => {
  const res = await api.delete(`/api/v1/reviews/admin/${id}`);
  return res.data;
};

export const resetReview = async (id: string) => {
  const res = await api.post(`/api/v1/reviews/${id}/reset`, {});
  return res.data;
};
