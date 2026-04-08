export interface ApiResponse<T = unknown> {
	success: boolean;
	msg: string;
	data: T;
}

export interface PaginatedData<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
}

// Shorthand types
export type ApiOk<T> = ApiResponse<T>;
export type ApiList<T> = ApiResponse<PaginatedData<T>>;
export type ApiEmpty = ApiResponse<null>;
