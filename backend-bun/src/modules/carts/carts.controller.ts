import type { Context } from "hono";
import { BaseController } from "@/shared/base";
import {
	AddToCartSchema,
	CartQuerySchema,
	CreateCartSchema,
	UpdateCartItemSchema,
} from "./carts.schema";
import { CartsService } from "./carts.service";

export class CartsController extends BaseController {
	private readonly cartsService = new CartsService();

	private getUserId(payload: { id?: string; sub?: string } | undefined): string | undefined {
		return payload?.id || payload?.sub;
	}

	// ===== User Cart Routes =====

	async getCart(c: Context) {
		const payload = c.get("jwtPayload") as { id?: string; sub?: string } | undefined;
		const userId = this.getUserId(payload);
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const cart = await this.cartsService.getUserCart(userId);
		return c.json(this.ok(cart));
	}

	async addItem(c: Context) {
		const payload = c.get("jwtPayload") as { id?: string; sub?: string } | undefined;
		const userId = this.getUserId(payload);
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const data = c.req.valid("json") as unknown;
		const validated = AddToCartSchema.parse(data);

		const cart = await this.cartsService.addItem(
			userId,
			validated.app,
			validated.itemType,
			validated.quantity,
			validated.plan,
		);
		return c.json(this.ok(cart, "Thêm vào giỏ hàng thành công"));
	}

	async updateItem(c: Context) {
		const payload = c.get("jwtPayload") as { id?: string; sub?: string } | undefined;
		const userId = this.getUserId(payload);
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const { app } = c.req.param();
		if (!app) return c.json(this.fail("Thiếu app id"), 400);
		const data = c.req.valid("json") as unknown;
		const validated = UpdateCartItemSchema.parse(data);

		const cart = await this.cartsService.updateItem(userId, app, {
			quantity: validated.quantity,
			plan: validated.plan,
		});
		return c.json(this.ok(cart, "Cập nhật giỏ hàng thành công"));
	}

	async removeItem(c: Context) {
		const payload = c.get("jwtPayload") as { id?: string; sub?: string } | undefined;
		const userId = this.getUserId(payload);
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const { app } = c.req.param();
		if (!app) return c.json(this.fail("Thiếu app id"), 400);
		const cart = await this.cartsService.removeItem(userId, app);
		return c.json(this.ok(cart, "Xóa khỏi giỏ hàng thành công"));
	}

	async clearCart(c: Context) {
		const payload = c.get("jwtPayload") as { id?: string; sub?: string } | undefined;
		const userId = this.getUserId(payload);
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		await this.cartsService.clearCart(userId);
		return c.json(this.ok(null, "Xóa giỏ hàng thành công"));
	}

	// ===== Admin Cart Routes =====

	async getAllCarts(c: Context) {
		const query = CartQuerySchema.parse(c.req.query());
		const result = await this.cartsService.getAllCarts(query.page, query.limit);
		return c.json(this.ok(result));
	}

	async createCart(c: Context) {
		const data = c.req.valid("json") as unknown;
		const validated = CreateCartSchema.parse(data);

		const cart = await this.cartsService.createCart(
			validated.user,
			validated.app,
			validated.itemType,
		);
		return c.json(this.ok(cart, "Tạo cart thành công"), 201);
	}

	async deleteCart(c: Context) {
		const { id } = c.req.param();
		if (!id) return c.json(this.fail("Thiếu cart id"), 400);
		await this.cartsService.deleteCart(id);
		return c.json(this.ok(null, "Xóa giỏ hàng thành công"));
	}
}
