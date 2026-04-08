import { sign, verify } from "hono/jwt";
import { env } from "@/config/env";
import { badRequest, unauthorized } from "@/shared/errors";
import type {
	ChangePasswordRequest,
	GoogleVerifyRequest,
	LoginRequest,
	VerifyTwoFactorRequest,
} from "./auth.schema";
import type { AuthResponse, UserPayload } from "./auth.types";
import { mongoose } from "../../infra/db/connection";
import type { Db } from "mongodb";

export class AuthService {
	/**
	 * Placeholder: Verify user logic using a real DB.
	 */
	async authenticate(data: LoginRequest): Promise<UserPayload> {
		const db = mongoose.connection.db;
		if (!db) throw badRequest("Database not connected");

		const user = await db.collection("users").findOne({ username: data.username });
		if (!user) {
			throw badRequest("Tài khoản không tồn tại");
		}

		const isMatch = await Bun.password.verify(data.password, user.password as string);
		if (!isMatch) {
			throw badRequest("Mật khẩu không hợp lệ");
		}

		return { id: user._id.toString(), email: user.email, role: user.role };
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

	private async ensureUniqueUsername(db: Db, base: string): Promise<string> {
		const trimmed = String(base || "")
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9._-]/g, "")
			.slice(0, 24);
		const candidateBase = trimmed || `user${Date.now().toString().slice(-6)}`;

		for (let i = 0; i < 50; i += 1) {
			const username = i === 0 ? candidateBase : `${candidateBase}${i}`;
			const existing = await db.collection("users").findOne({ username });
			if (!existing) return username;
		}

		return `${candidateBase}-${Math.random().toString(36).slice(2, 6)}`;
	}

	private async findOrCreateGoogleUser(db: Db, profile: {
		googleId: string;
		email?: string;
		name?: string;
		picture?: string;
	}) {
		const now = new Date();
		const byGoogleId = await db.collection("users").findOne({
			googleId: profile.googleId,
		});
		if (byGoogleId) return byGoogleId;

		const byEmail = profile.email
			? await db.collection("users").findOne({
					email: profile.email,
			  })
			: null;

		if (byEmail) {
			await db.collection("users").updateOne(
				{ _id: byEmail._id },
				{
					$set: {
						googleId: profile.googleId,
						fullName: profile.name || byEmail.fullName,
						avatarUrl: profile.picture || byEmail.avatarUrl,
						updatedAt: now,
						provider: "google",
					},
				},
			);
			return await db.collection("users").findOne({ _id: byEmail._id });
		}

		const emailPrefix = (profile.email || "").split("@")[0] || "user";
		const username = await this.ensureUniqueUsername(db, emailPrefix);

		const doc = {
			username,
			email: profile.email || "",
			fullName: profile.name || username,
			avatarUrl: profile.picture || "",
			role: "USER",
			provider: "google",
			googleId: profile.googleId,
			createdAt: now,
			updatedAt: now,
		};

		const inserted = await db.collection("users").insertOne(doc);
		return await db.collection("users").findOne({ _id: inserted.insertedId });
	}

	private async verifyGoogleIdToken(idToken: string) {
		if (!env.GOOGLE_CLIENT_ID) {
			throw badRequest("Missing GOOGLE_CLIENT_ID in backend environment");
		}

		const url = new URL("https://oauth2.googleapis.com/tokeninfo");
		url.searchParams.set("id_token", idToken);
		const res = await fetch(url.toString());
		if (!res.ok) {
			const text = await res.text();
			throw badRequest(`Google tokeninfo verify failed: ${text}`);
		}

		const payload = (await res.json()) as {
			sub: string;
			email?: string;
			name?: string;
			picture?: string;
			email_verified?: string | boolean;
			aud?: string;
			iss?: string;
			exp?: string;
			iat?: string;
		};
		if (!payload?.sub) throw badRequest("Invalid Google credential");
		if (payload.aud !== env.GOOGLE_CLIENT_ID) {
			throw badRequest("Google token audience mismatch");
		}
		if (
			payload.iss &&
			payload.iss !== "accounts.google.com" &&
			payload.iss !== "https://accounts.google.com"
		) {
			throw badRequest("Google token issuer mismatch");
		}

		return payload;
	}

	async loginWithGoogleCredential(
		data: GoogleVerifyRequest,
	): Promise<AuthResponse> {
		const db = mongoose.connection.db;
		if (!db) throw badRequest("Database not connected");

		const googlePayload = await this.verifyGoogleIdToken(data.credential);
		if (!googlePayload?.sub) throw badRequest("Invalid Google credential");

		const userDoc = await this.findOrCreateGoogleUser(db, {
			googleId: googlePayload.sub,
			email: googlePayload.email,
			name: googlePayload.name,
			picture: googlePayload.picture,
		});

		const user: UserPayload = {
			id: userDoc._id.toString(),
			email: userDoc.email,
			role: userDoc.role,
		};

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

	async changePassword(userId: string, data: ChangePasswordRequest): Promise<void> {
		const db = mongoose.connection.db;
		if (!db) throw badRequest("Database not connected");

		const { ObjectId } = await import("mongodb");
		const user = await db.collection("users").findOne({
			_id: new ObjectId(userId),
		});
		if (!user) throw badRequest("Người dùng không tồn tại");

		const isMatch = await Bun.password.verify(
			data.currentPassword,
			user.password as string,
		);
		if (!isMatch) throw badRequest("Mật khẩu hiện tại không đúng");

		const newHashedPassword = await Bun.password.hash(data.newPassword);
		await db.collection("users").updateOne(
			{ _id: new ObjectId(userId) },
			{ $set: { password: newHashedPassword, updatedAt: new Date() } },
		);
	}

	async enableTwoFactor(userId: string): Promise<{ setupCode: string }> {
		const db = mongoose.connection.db;
		if (!db) throw badRequest("Database not connected");

		const { ObjectId } = await import("mongodb");
		const setupCode = String(Math.floor(100000 + Math.random() * 900000));

		await db.collection("users").updateOne(
			{ _id: new ObjectId(userId) },
			{
				$set: {
					twoFactorEnabled: false,
					twoFactorCode: setupCode,
					twoFactorUpdatedAt: new Date(),
				},
			},
		);

		return { setupCode };
	}

	async getSecurityStatus(
		userId: string,
	): Promise<{ twoFactorEnabled: boolean; twoFactorUpdatedAt?: string }> {
		const db = mongoose.connection.db;
		if (!db) throw badRequest("Database not connected");

		const { ObjectId } = await import("mongodb");
		const user = await db.collection("users").findOne(
			{ _id: new ObjectId(userId) },
			{ projection: { twoFactorEnabled: 1, twoFactorUpdatedAt: 1 } },
		);
		if (!user) throw badRequest("Người dùng không tồn tại");

		return {
			twoFactorEnabled: Boolean(user.twoFactorEnabled),
			twoFactorUpdatedAt: user.twoFactorUpdatedAt
				? new Date(user.twoFactorUpdatedAt).toISOString()
				: undefined,
		};
	}

	async verifyTwoFactor(
		userId: string,
		data: VerifyTwoFactorRequest,
	): Promise<{ enabled: boolean }> {
		const db = mongoose.connection.db;
		if (!db) throw badRequest("Database not connected");

		const { ObjectId } = await import("mongodb");
		const user = await db.collection("users").findOne({
			_id: new ObjectId(userId),
		});
		if (!user) throw badRequest("Người dùng không tồn tại");

		if (!user.twoFactorCode || user.twoFactorCode !== data.code) {
			throw badRequest("Mã xác minh 2FA không hợp lệ");
		}

		await db.collection("users").updateOne(
			{ _id: new ObjectId(userId) },
			{
				$set: {
					twoFactorEnabled: true,
					twoFactorUpdatedAt: new Date(),
				},
				$unset: {
					twoFactorCode: "",
				},
			},
		);

		return { enabled: true };
	}
}
