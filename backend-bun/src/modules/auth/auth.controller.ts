import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { env } from "@/config/env";
import { BaseController } from "@/shared/base";
import type {
	ChangePasswordRequest,
	GoogleVerifyRequest,
	LoginRequest,
	VerifyTwoFactorRequest,
} from "./auth.schema";
import { AuthService } from "./auth.service";

export class AuthController extends BaseController {
	private readonly authService = new AuthService();

	private setAuthCookies(
		c: Context,
		payload: { accessToken: string; refreshToken: string },
	) {
		setCookie(c, "access_token", payload.accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: env.JWT_ACCESS_EXPIRES_IN,
			path: "/",
		});

		setCookie(c, "refresh_token", payload.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: env.JWT_REFRESH_EXPIRES_IN,
			path: "/",
		});
	}

	async login(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json") as LoginRequest;

		const result = await this.authService.login(data);

		this.setAuthCookies(c, result);

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

			this.setAuthCookies(c, result);

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

	googleStart(c: Context) {
		if (!env.GOOGLE_CLIENT_ID) {
			return c.json(this.fail("Missing GOOGLE_CLIENT_ID"), 500);
		}

		const redirect = c.req.query("redirect") || env.FRONTEND_URL;
		const state = Buffer.from(JSON.stringify({ redirect })).toString("base64url");

		const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
		url.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
		url.searchParams.set("redirect_uri", env.GOOGLE_REDIRECT_URI);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("scope", "openid email profile");
		url.searchParams.set("state", state);
		url.searchParams.set("prompt", "select_account");

		return c.redirect(url.toString());
	}

	async googleCallback(c: Context) {
		const idToken = c.req.query("id_token");
		const state = c.req.query("state") || "";

		let redirect = env.FRONTEND_URL;
		try {
			if (state) {
				const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
				if (decoded?.redirect) redirect = String(decoded.redirect);
			}
		} catch {
			// ignore
		}

		if (!idToken) {
			return c.redirect(
				`${redirect}/login?google=error&reason=missing_id_token`,
			);
		}

		try {
			const result = await this.authService.loginWithGoogleCredential({
				credential: idToken,
			});
			this.setAuthCookies(c, result);

			return c.redirect(`${redirect}/login?google=success`);
		} catch (err) {
			const reason = encodeURIComponent(
				err instanceof Error ? err.message : "google_login_failed",
			);
			return c.redirect(`${redirect}/login?google=error&reason=${reason}`);
		}
	}

	async googleVerify(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json") as GoogleVerifyRequest;
		const result = await this.authService.loginWithGoogleCredential(data);
		this.setAuthCookies(c, result);
		return c.json(
			this.ok(
				{ user: result.user, token: result.accessToken },
				"Đăng nhập Google thành công",
			),
		);
	}
}
