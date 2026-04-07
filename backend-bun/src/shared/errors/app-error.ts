export class AppError extends Error {
	public readonly statusCode: number;
	public readonly isOperational: boolean;

	constructor(message: string, statusCode = 400, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		// Error.captureStackTrace is V8 specific, Bun supports it
		Error.captureStackTrace(this, this.constructor);
	}
}

export const badRequest = (message: string) => new AppError(message, 400);
export const unauthorized = (message = "Unauthorized") =>
	new AppError(message, 401);
export const forbidden = (message = "Forbidden") => new AppError(message, 403);
export const notFound = (message = "Not found") => new AppError(message, 404);
export const conflict = (message = "Conflict") => new AppError(message, 409);
export const internal = (message = "Internal Server Error") =>
	new AppError(message, 500, false);
