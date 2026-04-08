import type { Context } from "hono";
import { AppError } from "@/shared/errors";
import {
	apiCreated,
	apiNoContent,
	apiSuccess,
} from "@/shared/utils/api-response.util";
import type {
	AppQueryRequest,
	CreateAppRequest,
	UpdateAppRequest,
} from "./apps.schema";
import { AppsService } from "./apps.service";
import type { AppFilters, AppWithRelations, PaginatedApps } from "./apps.types";

export class AppsController {
	private service: AppsService;

	constructor(service?: AppsService) {
		this.service = service || new AppsService();
	}

	private isAdminRole(role?: string): boolean {
		return role === "ADMIN" || role === "MODERATOR";
	}

	private getAuthRole(c: Context): string | undefined {
		const payload =
			(c.get("payload") as { role?: string } | undefined) ||
			(c.get("jwtPayload") as { role?: string } | undefined);
		return payload?.role?.toUpperCase();
	}

	private toAbsoluteUrl(c: Context, maybeRelativeUrl?: string): string {
		if (!maybeRelativeUrl) return "";
		if (maybeRelativeUrl.startsWith("http://") || maybeRelativeUrl.startsWith("https://")) {
			return maybeRelativeUrl;
		}
		return new URL(maybeRelativeUrl, c.req.url).toString();
	}

	private withAbsoluteIconUrl(
		c: Context,
		app: AppWithRelations,
	): AppWithRelations {
		return {
			...app,
			iconUrl: app.iconUrl ? this.toAbsoluteUrl(c, app.iconUrl) : app.iconUrl,
		};
	}

	private withAbsoluteIconUrls(
		c: Context,
		result: PaginatedApps,
	): PaginatedApps {
		return {
			...result,
			docs: result.docs.map((a) => this.withAbsoluteIconUrl(c, a)),
		};
	}

	private assertAdmin(c: Context) {
		const payload = c.get("jwtPayload");
		if (!this.isAdminRole(payload?.role)) {
			throw AppError.forbidden("Admin approval is required");
		}
		return payload;
	}

	/**
	 * GET /apps - List all published apps (public)
	 * GET /apps/admin - List all apps with filters (admin)
	 */
	async list(c: Context) {
		const query = c.req.valid("query") as AppQueryRequest;
		const role = this.getAuthRole(c);
		const isAdmin = c.req.query("admin") === "true" || this.isAdminRole(role);

		const filters: AppFilters = {
			status: query.status,
			category: query.category,
			developer: query.developer,
			search: query.search,
			tags: query.tags,
			isDisabled: query.isDisabled,
			isDeleted: query.isDeleted,
		};

		// Non-admin: default to published status
		if (!isAdmin && !query.status) {
			filters.status = "published";
		}

		const result = await this.service.findAll(filters, query.page, query.limit);
		return apiSuccess(c, this.withAbsoluteIconUrls(c, result));
	}

	/**
	 * GET /apps/:id - Get app by ID
	 */
	async getById(c: Context) {
		const id = c.req.param("id");
		const role = this.getAuthRole(c);
		const includeDeleted = this.isAdminRole(role);
		const app = await this.service.findById(id, { includeDeleted });
		return apiSuccess(c, this.withAbsoluteIconUrl(c, app));
	}

	/**
	 * GET /apps/slug/:slug - Get app by slug
	 */
	async getBySlug(c: Context) {
		const slug = c.req.param("slug");
		const app = await this.service.findBySlug(slug);
		return apiSuccess(c, this.withAbsoluteIconUrl(c, app));
	}

	/**
	 * GET /apps/developer/:developer - Get apps by developer
	 */
	async getByDeveloper(c: Context) {
		const developer = c.req.param("developer");
		const apps = await this.service.findByDeveloper(developer);
		return apiSuccess(
			c,
			apps.map((a) => this.withAbsoluteIconUrl(c, a)),
		);
	}

	/**
	 * POST /apps - Create new app
	 */
	async create(c: Context) {
		const body = c.req.valid("json") as CreateAppRequest & {
			developerId?: string;
			categoryId?: string;
		};
		const payload = c.get("jwtPayload");
		const app = await this.service.create(
			{
				...body,
				developer: body.developer || body.developerId || "",
				category: body.category || body.categoryId || "",
			},
			payload.id,
			payload.role,
		);
		return apiCreated(c, app);
	}

	/**
	 * PUT /apps/:id - Update app
	 */
	async update(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateAppRequest;
		const payload = c.get("jwtPayload");
		const isAdmin = this.isAdminRole(payload?.role);
		const { status, ...safeBody } = body;
		const app = await this.service.update(id, isAdmin ? body : safeBody);
		return apiSuccess(c, app);
	}

	/**
	 * DELETE /apps/:id - Soft delete app
	 */
	async delete(c: Context) {
		const id = c.req.param("id");
		await this.service.delete(id);
		return apiNoContent(c);
	}

	/**
	 * POST /apps/:id/restore - Restore a deleted app (admin)
	 */
	async restore(c: Context) {
		this.assertAdmin(c);
		const id = c.req.param("id");
		const app = await this.service.restore(id);
		return apiSuccess(c, this.withAbsoluteIconUrl(c, app));
	}

	/**
	 * POST /apps/approve/:id - Approve and publish app
	 */
	async approve(c: Context) {
		this.assertAdmin(c);
		const id = c.req.param("id");
		const app = await this.service.approve(id);
		return apiSuccess(c, app);
	}

	/**
	 * POST /apps/publish/:id - Publish app
	 */
	async publish(c: Context) {
		this.assertAdmin(c);
		const id = c.req.param("id");
		const app = await this.service.publish(id);
		return apiSuccess(c, app);
	}

	/**
	 * POST /apps/reject/:id - Reject app
	 */
	async reject(c: Context) {
		this.assertAdmin(c);
		const id = c.req.param("id");
		const app = await this.service.reject(id);
		return apiSuccess(c, app);
	}

	/**
	 * PATCH /apps/:id/disable - Disable app (toggle)
	 */
	async disable(c: Context) {
		const id = c.req.param("id");
		const app = await this.service.toggleDisable(id);
		return apiSuccess(c, app);
	}

	/**
	 * PATCH /apps/:id/toggle-disable - Toggle disable status
	 */
	async toggleDisable(c: Context) {
		return this.disable(c);
	}

	/**
	 * PATCH /apps/:id/status - Update app status
	 */
	async updateStatus(c: Context) {
		this.assertAdmin(c);
		const id = c.req.param("id");
		const body = await c.req.json<{ status: string }>();
		const app = await this.service.updateStatus(
			id,
			body.status as "pending" | "published" | "rejected" | "archived",
		);
		return apiSuccess(c, app);
	}
}
