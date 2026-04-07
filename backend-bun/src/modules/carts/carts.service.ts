import { CartsRepository } from "./carts.repository";
import { badRequest, notFound } from "@/shared/errors";
import type { ICart, ICartPublic, CartItem } from "./carts.types";
import type { AddToCartRequest } from "./carts.schema";
import { ObjectId } from "mongoose";

export class CartsService {
	private readonly repository = new CartsRepository();

	async getCart(userId: string): Promise<ICartPublic> {
		let cart = await this.repository.findByUserId(userId);
		if (!cart) {
			// Auto-create empty cart
			cart = await this.repository.addItem(userId, {
				appId: new ObjectId(),
				priceAtAdded: 0,
				addedAt: new Date(),
			} as any);
			(cart as any).items = [];
		}
		return this.toPublic(cart);
	}

	async addItem(userId: string, data: AddToCartRequest): Promise<ICartPublic> {
		// Check if app already in cart - update price instead
		const existingCart = await this.repository.findByUserId(userId);
		if (existingCart) {
			const existing = existingCart.items.find(
				(i) => i.appId.toString() === data.appId,
			);
			if (existing) {
				const updated = await this.repository.updateItem(userId, data.appId, {
					priceAtAdded: data.price,
				});
				return this.toPublic(updated!);
			}
		}

		const item: CartItem = {
			appId: new ObjectId(data.appId) as any,
			priceAtAdded: data.price,
			addedAt: new Date(),
		};

		const cart = await this.repository.addItem(userId, item);
		if (!cart) throw notFound("Không thể thêm vào giỏ hàng");
		return this.toPublic(cart);
	}

	async updateItem(userId: string, appId: string, price: number): Promise<ICartPublic> {
		const cart = await this.repository.updateItem(userId, appId, { priceAtAdded: price });
		if (!cart) throw notFound("Sản phẩm không có trong giỏ hàng");
		return this.toPublic(cart);
	}

	async removeItem(userId: string, appId: string): Promise<ICartPublic> {
		const cart = await this.repository.removeItem(userId, appId);
		if (!cart) throw notFound("Sản phẩm không có trong giỏ hàng");
		return this.toPublic(cart);
	}

	async clearCart(userId: string): Promise<boolean> {
		return this.repository.clearCart(userId);
	}

	private toPublic(cart: ICart): ICartPublic {
		const items = cart.items.map((item) => ({
			appId: item.appId.toString(),
			priceAtAdded: item.priceAtAdded,
			addedAt: item.addedAt,
		}));

		return {
			id: cart._id?.toString() ?? "",
			userId: cart.userId.toString(),
			items,
			totalItems: items.length,
			totalAmount: items.reduce((sum, item) => sum + item.priceAtAdded, 0),
		};
	}
}
