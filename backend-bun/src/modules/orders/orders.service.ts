import { Types } from "mongoose";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
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
	PaymentStatus,
} from "./orders.types";
import { OrderStatus as OrdStatus, PaymentStatus as PayStatus } from "./orders.types";

export class OrdersService {
	private readonly repository = new OrdersRepository();
	private readonly cartsService = new CartsService();
	private readonly couponsService = new CouponsService();
	private generateOrderNo(): string {
		const stamp = Date.now().toString().slice(-8);
		const rnd = Math.floor(Math.random() * 9000 + 1000);
		return `APK-${stamp}${rnd}`;
	}

	private paymentContent(orderNo: string): string {
		return `APK ${orderNo}`;
	}

	private normalizeOrderNo(input: string): string {
		const normalized = input
			.trim()
			.replace(/^#/, "")
			.replace(/\s+/g, "")
			.toUpperCase();
		if (/^APK[0-9A-Z]/.test(normalized) && !normalized.startsWith("APK-")) {
			return `APK-${normalized.slice(3)}`;
		}
		return normalized;
	}

	private matchesOrderCode(order: IOrder, normalizedCode: string): boolean {
		const orderNo = (order.orderNo || "").toUpperCase();
		const fallbackOrderNo = order._id
			? `APK-${order._id.toString().slice(-8).toUpperCase()}`
			: "";
		const candidateCodes = [
			orderNo,
			orderNo.replace(/^APK-/, ""),
			fallbackOrderNo,
			fallbackOrderNo.replace(/^APK-/, ""),
		].filter(Boolean);
		return candidateCodes.includes(normalizedCode);
	}

	private toPaidAmount(value?: number | string): number {
		if (typeof value === "number") return Number.isFinite(value) ? value : 0;
		if (typeof value !== "string") return 0;
		const amount = Number.parseFloat(value);
		return Number.isFinite(amount) ? amount : 0;
	}

	private paymentStatusFromAmount(
		paidAmount: number,
		requiredAmount: number,
	): PaymentStatus | null {
		if (paidAmount < requiredAmount) return null;
		return paidAmount > requiredAmount ? PayStatus.OVERPAID : PayStatus.EXACT;
	}

	private async resolveItemPrice(appId: string, inputPrice: number): Promise<number> {
		if (inputPrice > 0) return inputPrice;
		if (!ObjectId.isValid(appId)) return inputPrice;
		// biome-ignore lint/style/noNonNullAssertion: initialized on bootstrap
		const db = mongoose.connection.db!;
		const app = await db.collection("apps").findOne(
			{ _id: new ObjectId(appId) },
			{ projection: { price: 1 } },
		);
		return typeof app?.price === "number" && app.price > 0 ? app.price : inputPrice;
	}

	async create(
		user: string,
		data: CreateOrderRequest,
	): Promise<IOrderPublic> {
		if (data.items.length === 0) {
			throw badRequest("Đơn hàng phải có ít nhất 1 sản phẩm");
		}

		const normalizedItems = await Promise.all(
			data.items.map(async (item) => ({
				...item,
				price: await this.resolveItemPrice(item.app, item.price),
			})),
		);
		if (normalizedItems.some((item) => item.price <= 0)) {
			throw badRequest("Giá sản phẩm không hợp lệ");
		}

		const totalAmount = normalizedItems.reduce((sum, item) => sum + item.price, 0);

		let discountAmount = 0;
		if (data.couponCode) {
			const applyResult = await this.couponsService.applyCoupon(
				data.couponCode,
				totalAmount,
				undefined,
			);
			discountAmount = applyResult.discount;
		}

		const orderNo = this.generateOrderNo();

		const order = await this.repository.create({
			orderNo,
			user: new Types.ObjectId(user) as unknown as IOrder["user"],
			items: normalizedItems.map((item) => ({
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
			paymentContent: this.paymentContent(orderNo),
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

	async getMyOrder(id: string, user: string): Promise<IOrderPublic> {
		const order = await this.repository.findById(id);
		if (!order) throw notFound("Đơn hàng không tồn tại");
		if (order.user.toString() !== user) throw notFound("Đơn hàng không tồn tại");
		return this.toPublic(order);
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
			order.finalAmount,
			PayStatus.EXACT,
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

	async listPendingBankOrders(limit = 200): Promise<IOrder[]> {
		return this.repository.findPendingBankOrders(limit);
	}

	/** Hủy đơn chưa thanh toán có createdAt trước mốc cutoff */
	async cancelUnpaidOrdersCreatedBefore(cutoff: Date): Promise<number> {
		return this.repository.cancelUnpaidOrdersOlderThan(cutoff);
	}

	async markOrderPaidByOrderNo(
		orderNo: string,
		paymentId: string,
		txAmount?: number | string,
	): Promise<IOrderPublic | null> {
		const normalizedOrderNo = this.normalizeOrderNo(orderNo);
		const pendingOrders = await this.listPendingBankOrders(500);
		const matchedOrder = pendingOrders.find((order) =>
			this.matchesOrderCode(order, normalizedOrderNo),
		);
		if (!matchedOrder?._id) return null;
		const paidAmount = this.toPaidAmount(txAmount);
		const paymentStatus = this.paymentStatusFromAmount(
			paidAmount,
			matchedOrder.finalAmount,
		);
		if (!paymentStatus) return null;

		const fallbackUpdated = await this.repository.updatePayment(
			matchedOrder._id.toString(),
			paymentId,
			new Date(),
			paidAmount,
			paymentStatus,
		);
		return fallbackUpdated ? this.toPublic(fallbackUpdated) : null;
	}

	private toPublic(order: IOrder): IOrderPublic {
		const fallbackOrderNo = order._id ? `APK-${order._id.toString().slice(-8).toUpperCase()}` : "";
		return {
			id: order._id?.toString() ?? "",
			orderNo: order.orderNo || fallbackOrderNo,
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
			paymentRef: order.paymentRef,
			paymentContent:
				order.paymentContent ||
				(order.orderNo ? this.paymentContent(order.orderNo) : undefined),
			paymentStatus: order.paymentStatus,
			paidAmount: order.paidAmount,
			paidAt: order.paidAt,
			createdAt: order.createdAt as Date,
		};
	}
}
