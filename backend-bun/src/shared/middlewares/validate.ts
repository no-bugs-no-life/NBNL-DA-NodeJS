import { zValidator } from "@hono/zod-validator";
import type { ZodSchema } from "zod";
import { fail } from "@/shared/utils";

/**
 * Validates request body (JSON)
 */
export const validateBody = (schema: ZodSchema) => {
	return zValidator("json", schema, (result, c) => {
		if (!result.success) {
			return c.json(fail("Dữ liệu đầu vào không hợp lệ", result.error), 400);
		}
	});
};

/**
 * Validates request query parameters
 */
export const validateQuery = (schema: ZodSchema) => {
	return zValidator("query", schema, (result, c) => {
		if (!result.success) {
			return c.json(fail("Truy vấn không hợp lệ", result.error), 400);
		}
	});
};

/**
 * Validates route parameters
 */
export const validateParams = (schema: ZodSchema) => {
	return zValidator("param", schema, (result, c) => {
		if (!result.success) {
			return c.json(fail("Tham số đường dẫn không hợp lệ", result.error), 400);
		}
	});
};
