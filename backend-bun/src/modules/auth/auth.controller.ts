import { setCookie, deleteCookie, getCookie } from "hono/cookie";
import { env } from "@/config/env";
import { BaseController } from "@/shared/base";
import { LoginSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { badRequest } from "@/shared/errors";
import type { LoginRequest } from "./auth.schema";
import type { Context } from "hono";

export class AuthController extends BaseController {
	private readonly authService = new AuthService();

	async login(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json") as LoginRequest;

		const result = await this.authService.login(data);

		// Lưu accessToken vào HTTP-only cookie
		setCookie(c, "access_token", result.accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: env.JWT_ACCESS_EXPIRES_IN,
			path: "/",
		});

		// Lưu refreshToken vào HTTP-only cookie
		setCookie(c, "refresh_token", result.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: env.JWT_REFRESH_EXPIRES_IN,
			path: "/",
		});

		return c.json(this.ok(result.user, "Đăng nhập thành công"));
	}

	async logout(c: Context) {
		deleteCookie(c, "access_token", { path: "/" });
		deleteCookie(c, "refresh_token", { path: "/" });
		return c.json(this.ok(null, "Đăng xuất thành công"));
	}

	async refresh(c: Context) {
		const refreshToken = getCookie(c, "refresh_token");
		if (!refreshToken)
			return c.json(this.fail("Không tìm thấy refresh token"), 401);

		try {
			const result = await this.authService.refresh(refreshToken);

			setCookie(c, "access_token", result.accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "Strict",
				maxAge: env.JWT_ACCESS_EXPIRES_IN,
				path: "/",
			});

			setCookie(c, "refresh_token", result.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "Strict",
				maxAge: env.JWT_REFRESH_EXPIRES_IN,
				path: "/",
			});

			return c.json(this.ok(result.user, "Làm mới token thành công"));
		} catch (error: any) {
			return c.json(
				this.fail(error?.message || "Refresh token không hợp lệ"),
				401,
			);
		}
	}

	async me(c: Context) {
		// Đọc payload từ Middleware (xem JWT middleware cấu hình)
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		return c.json(this.ok(payload, "Thông tin người dùng"));
	}
}
