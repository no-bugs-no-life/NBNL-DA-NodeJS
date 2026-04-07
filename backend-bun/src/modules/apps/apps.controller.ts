import type { Context } from "hono";
import { AppsService } from "./apps.service";
import { ok, paginated } from "@/shared/utils/api-response.util";
import type { CreateAppRequest, UpdateAppRequest } from "./apps.schema";
import type { AppFilters, App } from "./apps.types";

export class AppsController {
	private service: AppsService;

	constructor(service?: AppsService) {
		this.service = service || new AppsService();
	}

	async list(c: Context) {
		const query = c.req.query();
		const page = Number(query.page) || 1;
		const limit = Math.min(Number(query.limit) || 20, 100);

		const filters: AppFilters = {
			status: query.status as App["status"] | undefined,
			categoryId: query.categoryId,
			developerId: query.developerId,
			search: query.search,
			tags: query.tags?.split(",").filter(Boolean),
		};

		const result = await this.service.findAll(filters, page, limit);
		return c.json(paginated(result.apps, result.total, result.page, result.limit));
	}

	async getById(c: Context) {
		const id = c.req.param("id") || "";
		if (!id) return c.json(ok(null, "Invalid ID"), 400);
		const app = await this.service.findById(id);
		return c.json(ok(app));
	}

	async getBySlug(c: Context) {
		const slug = c.req.param("slug") || "";
		if (!slug) return c.json(ok(null, "Invalid slug"), 400);
		const app = await this.service.findBySlug(slug);
		return c.json(ok(app));
	}

	async getByDeveloper(c: Context) {
		const developerId = c.req.param("developerId") || "";
		if (!developerId) return c.json(ok(null, "Invalid developer ID"), 400);
		const apps = await this.service.findByDeveloper(developerId);
		return c.json(ok(apps));
	}

	async create(c: Context) {
		const body = await c.req.json<CreateAppRequest>();
		const app = await this.service.create(body);
		return c.json(ok(app), 201);
	}

	async update(c: Context) {
		const id = c.req.param("id") || "";
		if (!id) return c.json(ok(null, "Invalid ID"), 400);
		const body = await c.req.json<UpdateAppRequest>();
		const app = await this.service.update(id, body);
		return c.json(ok(app));
	}

	async delete(c: Context) {
		const id = c.req.param("id") || "";
		if (!id) return c.json(ok(null as unknown as object, "Invalid ID"), 400);
		const hard = c.req.query("hard") === "true";
		await this.service.delete(id, hard);
		return c.status(204);
	}

	async updateStatus(c: Context) {
		const id = c.req.param("id") || "";
		if (!id) return c.json(ok(null, "Invalid ID"), 400);
		const body = await c.req.json<{ status: string }>();
		const app = await this.service.updateStatus(id, body.status as App["status"]);
		return c.json(ok(app));
	}

	async toggleDisable(c: Context) {
		const id = c.req.param("id") || "";
		if (!id) return c.json(ok(null, "Invalid ID"), 400);
		const app = await this.service.toggleDisable(id);
		return c.json(ok(app));
	}
}