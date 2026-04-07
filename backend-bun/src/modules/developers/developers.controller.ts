import type { Context } from "hono";
import { ok } from "@/shared/utils/api-response.util";
import type {
	CreateDeveloperRequest,
	DeveloperQueryRequest,
} from "./developers.schema";
import { DevelopersService } from "./developers.service";
import type {
	CreateDeveloperDTO,
	PaginatedDevelopers,
} from "./developers.types";

export class DevelopersController {
	private service: DevelopersService;

	constructor(service?: DevelopersService) {
		this.service = service || new DevelopersService();
	}

	/**
	 * GET /developers - List all developers
	 */
	async list(c: Context) {
		const query = c.req.query();
		const req: DeveloperQueryRequest = {
			page: Number(query.page) || 1,
			limit: Math.min(Number(query.limit) || 20, 100),
			sortBy: (query.sortBy as "createdAt" | "name" | "status") || "createdAt",
			order: Number(query.order) || -1,
			status: query.status as "pending" | "approved" | "rejected" | undefined,
			search: query.search,
		};

		const result = await this.service.findAll(req);

		const paginated: PaginatedDevelopers = {
			docs: result.developers,
			totalDocs: result.total,
			limit: req.limit,
			totalPages: Math.ceil(result.total / req.limit),
			page: req.page,
		};

		return c.json(ok(paginated));
	}

	/**
	 * GET /developers/:id - Get developer by ID
	 */
	async getById(c: Context) {
		const id = c.req.param("id") || "";
		if (!id) return c.json(ok(null), 400);
		const dev = await this.service.findById(id);
		return c.json(ok(dev));
	}

	/**
	 * GET /developers/my - Get current user's developer profile
	 */
	async getMyProfile(c: Context) {
		const userId = c.get("payload")?.sub;
		if (!userId) return c.json(ok(null), 401);

		const dev = await this.service.findByUserId(userId);
		if (!dev) return c.json(ok(null), 404);
		return c.json(ok(dev));
	}

	/**
	 * GET /developers/my/apps - Get current user's apps
	 */
	async getMyApps(c: Context) {
		const userId = c.get("payload")?.sub;
		if (!userId) return c.json(ok(null), 401);

		const dev = await this.service.findByUserId(userId);
		if (!dev) return c.json(ok(null), 404);

		return c.json(ok([]));
	}

	/**
	 * POST /developers - Create developer profile
	 */
	async create(c: Context) {
		const body = await c.req.json<CreateDeveloperRequest>();
		const userId = c.get("payload")?.sub;
		if (!userId) return c.json(ok(null), 401);

		const data: CreateDeveloperDTO = body.userId ? body : { ...body, userId };
		const dev = await this.service.create(data, userId);
		return c.json(ok(dev), 201);
	}

	/**
	 * PUT /developers/:id - Update developer
	 */
	async update(c: Context) {
		const id = c.req.param("id") || "";
		if (!id) return c.json(ok(null), 400);
		const body = await c.req.json();
		const dev = await this.service.update(id, body);
		return c.json(ok(dev));
	}

	/**
	 * PUT /developers/:id/approve - Approve developer (Admin)
	 */
	async approve(c: Context) {
		const id = c.req.param("id") || "";
		if (!id) return c.json(ok(null), 400);
		const body = await c.req.json<{ permissions?: Record<string, boolean> }>();
		const approvedBy = c.get("payload")?.sub;
		if (!approvedBy) return c.json(ok(null), 401);

		const dev = await this.service.approve(id, approvedBy, body.permissions);
		return c.json(ok(dev));
	}

	/**
	 * PUT /developers/:id/reject - Reject developer (Admin)
	 */
	async reject(c: Context) {
		const id = c.req.param("id") || "";
		if (!id) return c.json(ok(null), 400);
		const body = await c.req.json<{ reason: string }>();
		const dev = await this.service.reject(id, body.reason);
		return c.json(ok(dev));
	}

	/**
	 * PUT /developers/:id/revoke - Revoke developer access
	 */
	async revoke(c: Context) {
		const id = c.req.param("id") || "";
		if (!id) return c.json(ok(null), 400);
		const body = await c.req.json<{ reason?: string }>();
		const dev = await this.service.revoke(id, body.reason);
		return c.json(ok(dev));
	}

	/**
	 * PUT /developers/:id/permissions - Update developer permissions (Admin)
	 */
	async updatePermissions(c: Context) {
		const id = c.req.param("id") || "";
		if (!id) return c.json(ok(null), 400);
		const body = await c.req.json<{ permissions: Record<string, boolean> }>();
		const dev = await this.service.updatePermissions(id, body.permissions);
		return c.json(ok(dev));
	}

	/**
	 * DELETE /developers/:id - Soft delete developer
	 */
	async delete(c: Context) {
		const id = c.req.param("id") || "";
		if (!id) return c.json(ok(null), 400);
		await this.service.delete(id);
		return c.status(204);
	}
}
