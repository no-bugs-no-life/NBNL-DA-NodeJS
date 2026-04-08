import type { ApiResponse, PaginatedData } from "../types";

export const ok = <T>(data: T, msg = "Success"): ApiResponse<T> => ({
	success: true,
	msg,
	data,
});

export const fail = (msg: string, data: unknown = null): ApiResponse<unknown> => ({
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

import type { Context } from "hono";

// Aliases for convenience
export const apiSuccess = <T>(c: Context, data: T, msg?: string) =>
	c.json(ok(data, msg));

export const apiCreated = <T>(c: Context, data: T, msg = "Created") =>
	c.json(ok(data, msg), 201);

export const apiNoContent = (c: Context) => c.status(204);
