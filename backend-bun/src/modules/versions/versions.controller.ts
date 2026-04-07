import type { Context } from "hono";
import { AppError } from "@/shared/errors";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { VersionsService } from "./versions.service";
import { apiSuccess, apiCreated, apiNoContent } from "@/shared/utils/api-response.util";
import type { CreateVersionRequest, UpdateVersionRequest, VersionQueryRequest } from "./versions.schema";
import type { Platform } from "./versions.types";

interface AuthPayload {
	sub: string;
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

	list(c: Context) {
		const query = c.req.valid("query") as VersionQueryRequest;
		return apiSuccess(c, this.service.findAll(query));
	}

	getById(c: Context) {
		const id = c.req.param("id");
		return apiSuccess(c, this.service.findById(id));
	}

	getByApp(c: Context) {
		const appId = c.req.param("appId");
		return apiSuccess(c, this.service.findByAppId(appId));
	}

	getLatestByApp(c: Context) {
		const appId = c.req.param("appId");
		return apiSuccess(c, this.service.findLatestByAppId(appId));
	}

	getByPlatform(c: Context) {
		const appId = c.req.param("appId");
		const platform = c.req.param("platform") as Platform;
		return apiSuccess(c, this.service.findByPlatform(appId, platform));
	}

	create(c: Context) {
		const body = c.req.valid("json") as CreateVersionRequest;
		return apiCreated(c, this.service.create(body));
	}

	update(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateVersionRequest;
		return apiSuccess(c, this.service.update(id, body));
	}

	delete(c: Context) {
		const id = c.req.param("id");
		this.service.delete(id);
		return apiNoContent(c);
	}

	publish(c: Context) {
		const id = c.req.param("id");
		return apiSuccess(c, this.service.publish(id));
	}

	deprecate(c: Context) {
		const id = c.req.param("id");
		return apiSuccess(c, this.service.deprecate(id));
	}

	markLatest(c: Context) {
		const id = c.req.param("id");
		const appId = c.req.param("appId");
		return apiSuccess(c, this.service.markAsLatest(id, appId));
	}

	/**
	 * Get download info với permission check
	 * - Check user purchase status (truyền từ client hoặc query orders)
	 * - Generate short-lived token
	 */
	getDownloadInfo(c: Context) {
		const id = c.req.param("id");
		const platform = c.req.param("platform") as Platform;
		const user = this.getAuthUser(c);

		// TODO: Check purchase từ orders module (hoặc query orders service)
		const hasPurchased = false; // Placeholder - implement với orders service

		const result = this.service.getDownloadInfo(
			id,
			platform,
			user?.sub,
			user?.role,
			hasPurchased,
		);

		return apiSuccess(c, result);
	}

	/**
	 * Download file với token verification
	 */
	download(c: Context) {
		const token = c.req.query("token");
		const platform = c.req.query("platform") as Platform;

		if (!token) {
			throw AppError.badRequest("Missing token");
		}

		const payload = this.service.verifyDownloadToken(token);
		if (!payload) {
			throw AppError.unauthorized("Invalid or expired token");
		}

		// Verify platform match
		if (platform && payload.platform !== platform) {
			throw AppError.badRequest("Platform mismatch");
		}

		// Increment download count
		this.service.incrementDownloadCount(payload.versionId);

		return apiSuccess(c, {
			fileKey: payload.fileKey,
			platform: payload.platform,
		});
	}
}