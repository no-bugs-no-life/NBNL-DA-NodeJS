import type { Context } from "hono";
import { BaseController } from "@/shared/base";
import { CartsService } from "./carts.service";
import { AddToCartSchema, UpdateCartItemSchema, RemoveFromCartSchema } from "./carts.schema";

export class CartsController extends BaseController {
	private readonly cartsService = new CartsService();

	async getCart(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		const cart = await this.cartsService.getCart(payload.id);
		return c.json(this.ok(cart));
	}

	async addItem(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = AddToCartSchema.parse(data);

		const cart = await this.cartsService.addItem(payload.id, validated);
		return c.json(this.ok(cart, "Thêm vào giỏ hàng thành công"));
	}

	async updateItem(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		const { appId } = c.req.param();
		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = UpdateCartItemSchema.parse(data);

		const cart = await this.cartsService.updateItem(payload.id, appId, validated.price!);
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
}
