import { sign, verify } from "hono/jwt";
import { env } from "@/config/env";
import { badRequest, unauthorized } from "@/shared/errors";
import type { LoginRequest } from "./auth.schema";
import type { AuthResponse, UserPayload } from "./auth.types";

export class AuthService {
	/**
	 * Placeholder: Verify user logic using a real DB.
	 */
	async authenticate(data: LoginRequest): Promise<UserPayload> {
		// 🔥 TODO: Check DB using UserRepository
		if (data.email === "admin@example.com" && data.password === "123456") {
			return { id: "1", email: data.email, role: "ADMIN" };
		}
		throw badRequest("Mật khẩu hoặc email không hợp lệ");
	}

	async generateTokens(
		user: UserPayload,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const accessPayload = {
			...user,
			exp: Math.floor(Date.now() / 1000) + env.JWT_ACCESS_EXPIRES_IN,
		};
		const refreshPayload = {
			id: user.id,
			exp: Math.floor(Date.now() / 1000) + env.JWT_REFRESH_EXPIRES_IN,
		};

		const accessToken = await sign(accessPayload, env.JWT_ACCESS_SECRET);
		const refreshToken = await sign(refreshPayload, env.JWT_REFRESH_SECRET);

		return { accessToken, refreshToken };
	}

	async verifyAccessToken(token: string): Promise<UserPayload> {
		try {
			const decoded = await verify(token, env.JWT_ACCESS_SECRET, "HS256");
			return decoded as unknown as UserPayload;
		} catch (_error) {
			throw unauthorized("Access token không hợp lệ hoặc đã hết hạn");
		}
	}

	async verifyRefreshToken(
		token: string,
	): Promise<{ id: string; exp: number }> {
		try {
			const decoded = await verify(token, env.JWT_REFRESH_SECRET, "HS256");
			return decoded as unknown as { id: string; exp: number };
		} catch (_error) {
			throw unauthorized("Refresh token không hợp lệ hoặc đã hết hạn");
		}
	}

	async login(data: LoginRequest): Promise<AuthResponse> {
		const user = await this.authenticate(data);
		const tokens = await this.generateTokens(user);
		return { ...tokens, user };
	}

	async refresh(refreshToken: string): Promise<AuthResponse> {
		const decoded = await this.verifyRefreshToken(refreshToken);

		// 🔥 TODO: Fetch real user from DB using decoded.id
		const user = { id: decoded.id, email: "admin@example.com", role: "ADMIN" };

		const tokens = await this.generateTokens(user);
		return { ...tokens, user };
	}
}
