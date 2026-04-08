import type { Context } from "hono";
import { BaseController } from "@/shared/base";
import {
	CreateOrderSchema,
	OrderQuerySchema,
	UpdateOrderStatusSchema,
} from "./orders.schema";
import { OrdersService } from "./orders.service";

export class OrdersController extends BaseController {
	private readonly ordersService = new OrdersService();

	async create(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = CreateOrderSchema.parse(data);

		const order = await this.ordersService.create(payload.id, validated);
		return c.json(this.ok(order, "Tạo đơn hàng thành công"), 201);
	}

	async getMyOrders(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		const orders = await this.ordersService.getUserOrders(payload.id);
		return c.json(this.ok(orders));
	}

	async getMyOrderById(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);
		const { id } = c.req.param();
		const order = await this.ordersService.getMyOrder(id, payload.id);
		return c.json(this.ok(order));
	}

	async getAll(c: Context) {
		const query = OrderQuerySchema.parse(c.req.query());
		const { orders, total } = await this.ordersService.getAll(query);

		return c.json(
			this.paginated(orders, total, query.page ?? 1, query.limit ?? 20),
		);
	}

	async getById(c: Context) {
		const { id } = c.req.param();
		const order = await this.ordersService.getById(id);
		return c.json(this.ok(order));
	}

	async updateStatus(c: Context) {
		const { id } = c.req.param();
		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = UpdateOrderStatusSchema.parse(data);

		const order = await this.ordersService.updateStatus(id, validated.status);
		return c.json(this.ok(order, "Cập nhật trạng thái thành công"));
	}

	async confirmPayment(c: Context) {
		const { id } = c.req.param();
		const { paymentId } = await c.req.json<{ paymentId: string }>();

		if (!paymentId) return c.json(this.fail("Payment ID không hợp lệ"), 400);

		const order = await this.ordersService.confirmPayment(id, paymentId);
		return c.json(this.ok(order, "Xác nhận thanh toán thành công"));
	}
}
