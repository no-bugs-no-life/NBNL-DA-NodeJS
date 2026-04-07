import { Types } from "mongoose";
import { CartsService } from "@/modules/carts/carts.service";
import { CouponsService } from "@/modules/coupons/coupons.service";
import { badRequest, notFound } from "@/shared/errors";
import { OrdersRepository } from "./orders.repository";
import type { CreateOrderRequest } from "./orders.schema";
import type {
	IOrder,
	IOrderPublic,
	OrderQuery,
	OrderStatus,
} from "./orders.types";
import { OrderStatus as OrdStatus } from "./orders.types";

export class OrdersService {
	private readonly repository = new OrdersRepository();
	private readonly cartsService = new CartsService();
	private readonly couponsService = new CouponsService();

	async create(
		user: string,
		data: CreateOrderRequest,
	): Promise<IOrderPublic> {
		if (data.items.length === 0) {
			throw badRequest("Đơn hàng phải có ít nhất 1 sản phẩm");
		}

		const totalAmount = data.items.reduce((sum, item) => sum + item.price, 0);

		let discountAmount = 0;
		if (data.couponCode) {
			const applyResult = await this.couponsService.applyCoupon(
				data.couponCode,
				totalAmount,
				undefined,
			);
			discountAmount = applyResult.discount;
		}

		const order = await this.repository.create({
			user: new Types.ObjectId(user) as unknown as IOrder["user"],
			items: data.items.map((item) => ({
				app: new Types.ObjectId(item.app) as unknown as IOrder["items"][0]["app"],
				name: item.name,
				price: item.price,
				iconUrl: item.iconUrl,
			})),
			totalAmount,
			discountAmount,
			finalAmount: totalAmount - discountAmount,
			couponCode: data.couponCode,
			status: OrdStatus.PENDING,
			paymentMethod: data.paymentMethod,
		});

		return this.toPublic(order);
	}

	async getById(id: string): Promise<IOrderPublic> {
		const order = await this.repository.findById(id);
		if (!order) throw notFound("Đơn hàng không tồn tại");
		return this.toPublic(order);
	}

	async getUserOrders(user: string): Promise<IOrderPublic[]> {
		const orders = await this.repository.findByUserId(user);
		return orders.map((o) => this.toPublic(o));
	}

	async getAll(
		query: OrderQuery,
	): Promise<{ orders: IOrderPublic[]; total: number }> {
		const { orders, total } = await this.repository.findAllPaginated(query);
		return { orders: orders.map((o) => this.toPublic(o)), total };
	}

	async updateStatus(id: string, status: OrderStatus): Promise<IOrderPublic> {
		const order = await this.repository.updateStatus(id, status);
		if (!order) throw notFound("Đơn hàng không tồn tại");

		// If completed, clear user's cart
		if (status === OrdStatus.COMPLETED) {
			const user = order.user.toString();
			const apps = order.items.map((i) => i.app.toString());
			for (const app of apps) {
				try {
					await this.cartsService.removeItem(user, app);
				} catch {
					// Ignore if item not in cart
				}
			}
		}

		return this.toPublic(order);
	}

	async confirmPayment(id: string, paymentId: string): Promise<IOrderPublic> {
		const order = await this.repository.findById(id);
		if (!order) throw notFound("Đơn hàng không tồn tại");
		if (
			order.status !== OrdStatus.PENDING &&
			order.status !== OrdStatus.PROCESSING
		) {
			throw badRequest(
				"Không thể xác nhận thanh toán cho đơn hàng đã hoàn thành",
			);
		}

		const updated = await this.repository.updatePayment(
			id,
			paymentId,
			new Date(),
		);
		if (!updated) throw notFound("Đơn hàng không tồn tại");

		// Increment coupon usage if applied
		if (order.couponCode) {
			const coupon = await this.couponsService.getById(order.couponCode);
			if (coupon) {
				await this.couponsService.incrementUsage(order.couponCode);
			}
		}

		return this.toPublic(updated);
	}

	private toPublic(order: IOrder): IOrderPublic {
		return {
			id: order._id?.toString() ?? "",
			user: order.user.toString(),
			items: order.items.map((item) => ({
				app: item.app.toString(),
				name: item.name,
				price: item.price,
				iconUrl: item.iconUrl,
			})),
			totalAmount: order.totalAmount,
			discountAmount: order.discountAmount,
			finalAmount: order.finalAmount,
			couponCode: order.couponCode,
			status: order.status,
			paymentMethod: order.paymentMethod,
			paymentId: order.paymentId,
			paidAt: order.paidAt,
			createdAt: order.createdAt as Date,
		};
	}
}
