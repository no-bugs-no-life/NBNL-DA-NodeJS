import type { Context } from "hono";
import { AppError } from "@/shared/errors";
import {
	apiCreated,
	apiNoContent,
	apiSuccess,
} from "@/shared/utils/api-response.util";
import type {
	CreateVersionRequest,
	UpdateVersionRequest,
	VersionQueryRequest,
} from "./versions.schema";
import { VersionsService } from "./versions.service";
import type { Platform } from "./versions.types";

interface AuthPayload {
	sub?: string;
	id?: string;
	role: string;
}

export class VersionsController {
	private service: VersionsService;

	constructor(service?: VersionsService) {
		this.service = service || new VersionsService();
	}

	private getAuthUser(c: Context): AuthPayload | null {
		try {
			const payload = c.get("jwtPayload");
			return payload as AuthPayload;
		} catch {
			return null;
		}
	}

	private getUserId(user: AuthPayload | null): string | undefined {
		return user?.id || user?.sub;
	}

	private toAbsoluteUrl(c: Context, maybeRelativeUrl: string): string {
		if (maybeRelativeUrl.startsWith("http://") || maybeRelativeUrl.startsWith("https://")) {
			return maybeRelativeUrl;
		}
		return new URL(maybeRelativeUrl, c.req.url).toString();
	}

	async list(c: Context) {
		const query = c.req.valid("query") as VersionQueryRequest;
		const result = await this.service.findAll(query);
		return apiSuccess(c, result);
	}

	async getById(c: Context) {
		const id = c.req.param("id");
		const result = await this.service.findById(id);
		return apiSuccess(c, result);
	}

	async getByApp(c: Context) {
		const app = c.req.param("app");
		const versions = await this.service.findByAppId(app);
		return apiSuccess(c, versions);
	}

	async getLatestByApp(c: Context) {
		const app = c.req.param("app");
		const latest = await this.service.findLatestByAppId(app);
		return apiSuccess(c, latest);
	}

	async getByPlatform(c: Context) {
		const app = c.req.param("app");
		const platform = c.req.param("platform") as Platform;
		const versions = await this.service.findByPlatform(app, platform);
		return apiSuccess(c, versions);
	}

	async create(c: Context) {
		const body = c.req.valid("json") as CreateVersionRequest;
		const created = await this.service.create(body);
		return apiCreated(c, created);
	}

	async update(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateVersionRequest;
		const updated = await this.service.update(id, body);
		return apiSuccess(c, updated);
	}

	async delete(c: Context) {
		const id = c.req.param("id");
		await this.service.delete(id);
		return apiNoContent(c);
	}

	async publish(c: Context) {
		const id = c.req.param("id");
		const result = await this.service.publish(id);
		return apiSuccess(c, result);
	}

	async deprecate(c: Context) {
		const id = c.req.param("id");
		const result = await this.service.deprecate(id);
		return apiSuccess(c, result);
	}

	async revokeDownloadLink(c: Context) {
		const id = c.req.param("id");
		const result = await this.service.revokeDownloadLink(id);
		return apiSuccess(c, result);
	}

	async markLatest(c: Context) {
		const id = c.req.param("id");
		const app = c.req.param("app");
		const result = await this.service.markAsLatest(id, app);
		return apiSuccess(c, result);
	}

	/**
	 * Get download info với permission check
	 * - Check user purchase status (truyền từ client hoặc query orders)
	 * - Generate short-lived token
	 */
	async getDownloadInfo(c: Context) {
		const id = c.req.param("id");
		const platform = c.req.param("platform") as Platform;
		const user = this.getAuthUser(c);
		const userId = this.getUserId(user);
		if (!userId) throw AppError.unauthorized("Unauthorized");
		const hasPurchased = await this.service.hasPurchasedVersionApp(userId, id);

		const result = await this.service.getDownloadInfo(
			id,
			platform,
			userId,
			user?.role,
			hasPurchased,
		);

		return apiSuccess(c, {
			...result,
			downloadUrl: this.toAbsoluteUrl(c, result.downloadUrl),
		});
	}

	async getAppDownloadInfo(c: Context) {
		const appId = c.req.param("app");
		const platform = c.req.param("platform") as Platform;
		const user = this.getAuthUser(c);
		const userId = this.getUserId(user);
		if (!userId) throw AppError.unauthorized("Unauthorized");

		const result = await this.service.getLatestDownloadInfoByApp(
			appId,
			platform,
			userId,
			user?.role,
		);
		return apiSuccess(c, {
			...result,
			downloadUrl: this.toAbsoluteUrl(c, result.downloadUrl),
		});
	}

	/**
	 * Download file với token verification
	 */
	download(_c: Context) {
		throw AppError.notFound("Endpoint moved to /downloads/:downloadId");
	}
}
