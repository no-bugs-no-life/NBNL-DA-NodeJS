import type { ApiResponse, PaginatedData } from "../types";

export const ok = <T>(data: T, msg = "Success"): ApiResponse<T> => ({
	success: true,
	msg,
	data,
});

export const fail = (msg: string, data: any = null): ApiResponse<null> => ({
	success: false,
	msg,
	data,
});

export const paginated = <T>(
	items: T[],
	total: number,
	page: number,
	limit: number,
	msg = "Success",
): ApiResponse<PaginatedData<T>> => ({
	success: true,
	msg,
	data: { items, total, page, limit },
});
