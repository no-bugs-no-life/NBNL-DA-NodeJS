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

	// ===== User Cart Routes =====

	async getCart(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		const cart = await this.cartsService.getUserCart(payload.id);
		return c.json(this.ok(cart));
	}

	async addItem(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = AddToCartSchema.parse(data);

		const cart = await this.cartsService.addItem(
			payload.id,
			validated.appId,
			validated.itemType,
			validated.quantity,
			validated.plan,
		);
		return c.json(this.ok(cart, "Thêm vào giỏ hàng thành công"));
	}

	async updateItem(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		const { appId } = c.req.param();
		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = UpdateCartItemSchema.parse(data);

		const cart = await this.cartsService.updateItem(payload.id, appId, {
			quantity: validated.quantity,
			plan: validated.plan,
		});
		return c.json(this.ok(cart, "Cập nhật giỏ hàng thành công"));
	}

	async removeItem(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		const { appId } = c.req.param();
		const cart = await this.cartsService.removeItem(payload.id, appId);
		return c.json(this.ok(cart, "Xóa khỏi giỏ hàng thành công"));
	}

	async clearCart(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		await this.cartsService.clearCart(payload.id);
		return c.json(this.ok(null, "Xóa giỏ hàng thành công"));
	}

	// ===== Admin Cart Routes =====

	async getAllCarts(c: Context) {
		const query = CartQuerySchema.parse(c.req.query());
		const result = await this.cartsService.getAllCarts(query.page, query.limit);
		return c.json(this.ok(result));
	}

	async createCart(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = CreateCartSchema.parse(data);

		const cart = await this.cartsService.createCart(
			validated.userId,
			validated.appId,
			validated.itemType,
		);
		return c.json(this.ok(cart, "Tạo cart thành công"), 201);
	}

	async deleteCart(c: Context) {
		const { id } = c.req.param();
		await this.cartsService.deleteCart(id);
		return c.json(this.ok(null, "Xóa giỏ hàng thành công"));
	}
}
