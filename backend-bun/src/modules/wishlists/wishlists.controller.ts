import type { Context } from "hono";
import {
	apiCreated,
	apiNoContent,
	apiSuccess,
} from "@/shared/utils/api-response.util";
import type {
	AddToWishlistRequest,
	CreateWishlistRequest,
	UpdateWishlistRequest,
	WishlistQuery,
} from "./wishlists.schema";
import { WishlistsService } from "./wishlists.service";

export class WishlistsController {
	private service: WishlistsService;

	constructor(service?: WishlistsService) {
		this.service = service || new WishlistsService();
	}

	// User endpoints
	async getMyWishlist(c: Context) {
		const userId = c.req.var("userId") as string;
		const wishlist = await this.service.findByUserId(userId);
		return apiSuccess(c, wishlist);
	}

	async addApp(c: Context) {
		const body = c.req.valid("json") as AddToWishlistRequest;
		const userId = c.req.var("userId") as string;
		const wishlist = await this.service.addApp(userId, body.appId);
		return apiSuccess(c, wishlist);
	}

	async removeApp(c: Context) {
		const appId = c.req.param("appId");
		const userId = c.req.var("userId") as string;
		const wishlist = await this.service.removeApp(userId, appId);
		return apiSuccess(c, wishlist);
	}

	async clear(c: Context) {
		const userId = c.req.var("userId") as string;
		const wishlist = await this.service.clearApps(userId);
		return apiSuccess(c, wishlist);
	}

	// Admin endpoints
	async listAll(c: Context) {
		const query = c.req.valid("query") as WishlistQuery;
		const result = await this.service.findAll({
			page: query.page,
			limit: query.limit,
		});
		return apiSuccess(c, result);
	}

	async getById(c: Context) {
		const id = c.req.param("id");
		const wishlist = await this.service.findById(id);
		return apiSuccess(c, wishlist);
	}

	async create(c: Context) {
		const body = c.req.valid("json") as CreateWishlistRequest;
		const wishlist = await this.service.create(body);
		return apiCreated(c, wishlist);
	}

	async update(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateWishlistRequest;
		const wishlist = await this.service.update(id, body);
		return apiSuccess(c, wishlist);
	}

	async delete(c: Context) {
		const id = c.req.param("id");
		await this.service.delete(id);
		return apiNoContent(c);
	}
}
