import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { env } from "@/config/env";
import { BaseController } from "@/shared/base";
import type {
	ChangePasswordRequest,
	LoginRequest,
	VerifyTwoFactorRequest,
} from "./auth.schema";
import { AuthService } from "./auth.service";

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

		return c.json(
			this.ok(
				{ user: result.user, token: result.accessToken },
				"Đăng nhập thành công"
			)
		);
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
		} catch (error: unknown) {
			return c.json(
				this.fail((error as Error)?.message || "Refresh token không hợp lệ"),
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

	async changePassword(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json") as ChangePasswordRequest;
		const payload = c.get("jwtPayload") as
			| { id?: string; sub?: string }
			| undefined;
		const userId = payload?.id || payload?.sub;
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		await this.authService.changePassword(userId, data);
		return c.json(this.ok(null, "Đổi mật khẩu thành công"));
	}

	async enableTwoFactor(c: Context) {
		const payload = c.get("jwtPayload") as
			| { id?: string; sub?: string }
			| undefined;
		const userId = payload?.id || payload?.sub;
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const result = await this.authService.enableTwoFactor(userId);
		return c.json(this.ok(result, "Đã tạo mã thiết lập 2FA"));
	}

	async securityStatus(c: Context) {
		const payload = c.get("jwtPayload") as
			| { id?: string; sub?: string }
			| undefined;
		const userId = payload?.id || payload?.sub;
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const result = await this.authService.getSecurityStatus(userId);
		return c.json(this.ok(result, "Trạng thái bảo mật"));
	}

	async verifyTwoFactor(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json") as VerifyTwoFactorRequest;
		const payload = c.get("jwtPayload") as
			| { id?: string; sub?: string }
			| undefined;
		const userId = payload?.id || payload?.sub;
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const result = await this.authService.verifyTwoFactor(userId, data);
		return c.json(this.ok(result, "Xác minh 2FA thành công"));
	}
}
