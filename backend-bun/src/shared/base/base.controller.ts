import type { ApiResponse, PaginatedData } from "../types";
import { fail, ok, paginated } from "../utils";

/**
 * Abstract Base Controller
 * Handles basic HTTP response mapping and shared logic
 */
export abstract class BaseController {
	/**
	 * Standardized success response
	 */
	protected ok<T>(data: T, msg?: string): ApiResponse<T> {
		return ok(data, msg);
	}

	/**
	 * Standardized error response
	 */
	protected fail(message: string, data: unknown = null): ApiResponse<unknown> {
		return fail(message, data);
	}

	/**
	 * Standardized pagination response
	 */
	protected paginated<T>(
		items: T[],
		total: number,
		page: number,
		limit: number,
		msg?: string,
	): ApiResponse<PaginatedData<T>> {
		return paginated(items, total, page, limit, msg);
	}
}
