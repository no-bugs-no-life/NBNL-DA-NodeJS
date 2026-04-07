import type { Context } from "hono";
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
import type { AppFilters } from "./apps.types";

export class AppsController {
	private service: AppsService;

	constructor(service?: AppsService) {
		this.service = service || new AppsService();
	}

	/**
	 * GET /apps - List all published apps (public)
	 * GET /apps/admin - List all apps with filters (admin)
	 */
	async list(c: Context) {
		const query = c.req.valid("query") as AppQueryRequest;
		const isAdmin = c.req.query("admin") === "true";

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
		return apiSuccess(c, result);
	}

	/**
	 * GET /apps/:id - Get app by ID
	 */
	async getById(c: Context) {
		const id = c.req.param("id");
		const app = await this.service.findById(id);
		return apiSuccess(c, app);
	}

	/**
	 * GET /apps/slug/:slug - Get app by slug
	 */
	async getBySlug(c: Context) {
		const slug = c.req.param("slug");
		const app = await this.service.findBySlug(slug);
		return apiSuccess(c, app);
	}

	/**
	 * GET /apps/developer/:developer - Get apps by developer
	 */
	async getByDeveloper(c: Context) {
		const developer = c.req.param("developer");
		const apps = await this.service.findByDeveloper(developer);
		return apiSuccess(c, apps);
	}

	/**
	 * POST /apps - Create new app
	 */
	async create(c: Context) {
		const body = c.req.valid("json") as CreateAppRequest;
		const app = await this.service.create(body);
		return apiCreated(c, app);
	}

	/**
	 * PUT /apps/:id - Update app
	 */
	async update(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateAppRequest;
		const app = await this.service.update(id, body);
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
	 * POST /apps/approve/:id - Approve and publish app
	 */
	async approve(c: Context) {
		const id = c.req.param("id");
		const app = await this.service.approve(id);
		return apiSuccess(c, app);
	}

	/**
	 * POST /apps/publish/:id - Publish app
	 */
	async publish(c: Context) {
		const id = c.req.param("id");
		const app = await this.service.publish(id);
		return apiSuccess(c, app);
	}

	/**
	 * POST /apps/reject/:id - Reject app
	 */
	async reject(c: Context) {
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
		const id = c.req.param("id");
		const body = await c.req.json<{ status: string }>();
		const app = await this.service.updateStatus(
			id,
			body.status as "pending" | "published" | "rejected" | "archived",
		);
		return apiSuccess(c, app);
	}
}
