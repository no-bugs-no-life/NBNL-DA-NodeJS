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
    ? "/api/v1/admin/reviews/pending"
    : "/api/v1/admin/reviews";
  const res = await api.get(`${endpoint}?page=${page}&limit=${limit}`);
  return res.data;
};

export const createReviewAdmin = async (data: ReviewInput) => {
  // Backend expects `app` and `user` fields.
  const payload = {
    app: data.appId,
    user: data.userId,
    rating: data.rating,
    comment: data.comment,
    status: data.status,
  };
  const res = await api.post(`/api/v1/admin/reviews`, payload);
  return res.data;
};

export const updateReviewAdmin = async (
  id: string,
  data: Partial<ReviewInput>,
) => {
  const payload: Record<string, unknown> = {};
  if (data.appId !== undefined) payload.app = data.appId;
  if (data.userId !== undefined) payload.user = data.userId;
  if (data.rating !== undefined) payload.rating = data.rating;
  if (data.comment !== undefined) payload.comment = data.comment;
  if (data.status !== undefined) payload.status = data.status;
  const res = await api.put(`/api/v1/admin/reviews/${id}`, payload);
  return res.data;
};

export const approveReview = async (id: string) => {
  const res = await api.post(`/api/v1/admin/reviews/${id}/approve`, {});
  return res.data;
};

export const rejectReview = async (id: string) => {
  const res = await api.post(`/api/v1/admin/reviews/${id}/reject`, {});
  return res.data;
};

export const deleteReview = async (id: string) => {
  const res = await api.delete(`/api/v1/admin/reviews/${id}`);
  return res.data;
};

export const resetReview = async (id: string) => {
  const res = await api.post(`/api/v1/admin/reviews/${id}/reset`, {});
  return res.data;
};
