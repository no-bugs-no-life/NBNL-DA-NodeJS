import { badRequest, notFound } from "@/shared/errors";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { CartsRepository } from "./carts.repository";
import type {
	CartAppItem,
	CartItemResponse,
	CartResponse,
	ICart,
	PaginatedCartsResponse,
} from "./carts.types";
import { CartItemType, SubscriptionPlan } from "./carts.types";

export class CartsService {
	private readonly repository = new CartsRepository();

	private async getAppPrice(appId: string): Promise<number> {
		if (!ObjectId.isValid(appId)) return 0;
		// biome-ignore lint/style/noNonNullAssertion: initialized on bootstrap
		const db = mongoose.connection.db!;
		const app = await db.collection("apps").findOne(
			{ _id: new ObjectId(appId) },
			{ projection: { price: 1 } },
		);
		return typeof app?.price === "number" ? app.price : 0;
	}

	// User: Get own cart
	async getUserCart(user: string): Promise<CartResponse | null> {
		const cart = await this.repository.findByUserId(user);
		if (!cart) {
			// Create empty cart if not exists
			const newCart = await this.repository.createCart(user);
			return this.toResponse(newCart);
		}
		return this.toResponse(cart);
	}

	// User: Add item to cart
	async addItem(
		user: string,
		app: string,
		itemType: CartItemType = CartItemType.ONE_TIME,
		quantity: number = 1,
		plan?: SubscriptionPlan,
	): Promise<CartResponse> {
		const price = await this.getAppPrice(app);

		const cart = await this.repository.addItem(
			user,
			app,
			itemType,
			quantity,
			price,
			plan,
		);
		if (!cart) throw notFound("Không thể thêm vào giỏ hàng");
		return this.toResponse(cart);
	}

	// User: Update cart item
	async updateItem(
		user: string,
		app: string,
		data: { quantity?: number; plan?: SubscriptionPlan },
	): Promise<CartResponse> {
		const cart = await this.repository.updateItem(user, app, data);
		if (!cart) throw notFound("Sản phẩm không có trong giỏ hàng");
		return this.toResponse(cart);
	}

	// User: Remove item from cart
	async removeItem(user: string, app: string): Promise<CartResponse> {
		const cart = await this.repository.removeItem(user, app);
		if (!cart) throw notFound("Sản phẩm không có trong giỏ hàng");
		return this.toResponse(cart);
	}

	// User: Clear cart
	async clearCart(user: string): Promise<boolean> {
		return this.repository.clearCart(user);
	}

	// Admin: Get all carts paginated
	async getAllCarts(
		page: number = 1,
		limit: number = 20,
	): Promise<PaginatedCartsResponse> {
		const { carts, total } = await this.repository.findAllPaginated(
			page,
			limit,
		);
		return {
			docs: carts.map((c) => this.toResponse(c)),
			totalDocs: total,
			totalPages: Math.ceil(total / limit),
			page,
			limit,
		};
	}

	// Admin: Create cart for user
	async createCart(
		user: string,
		app: string,
		itemType: CartItemType,
	): Promise<CartResponse> {
		const price = await this.getAppPrice(app);
		const cart = await this.repository.addItem(user, app, itemType, 1, price);
		if (!cart) throw badRequest("Không thể tạo giỏ hàng");
		return this.toResponse(cart);
	}

	// Admin: Delete cart by ID
	async deleteCart(id: string): Promise<boolean> {
		return this.repository.deleteCart(id);
	}

	// Admin: Delete cart by user
	async deleteCartByUserId(user: string): Promise<boolean> {
		return this.repository.deleteCartByUserId(user);
	}

	private toResponse(cart: ICart): CartResponse {
		const items: CartItemResponse[] = cart.items.map((item) => {
			const appData =
				typeof item.app === "object" && "_id" in item.app
					? (item.app as CartAppItem)
					: { _id: item.app, name: "", iconUrl: "", price: item.priceAtAdd };

			return {
				_id: item._id?.toString() ?? "",
				appId: {
					_id:
						typeof appData._id === "object"
							? appData._id.toString()
							: appData._id,
					name: appData.name || "",
					iconUrl: appData.iconUrl || "",
					price: appData.price || item.priceAtAdd,
					subscriptionPrice: appData.subscriptionPrice,
				},
				app: {
					_id:
						typeof appData._id === "object"
							? appData._id.toString()
							: appData._id,
					name: appData.name || "",
					iconUrl: appData.iconUrl || "",
					price: appData.price || item.priceAtAdd,
					subscriptionPrice: appData.subscriptionPrice,
				},
				itemType: item.itemType,
				plan: item.plan,
				quantity: item.itemType === CartItemType.ONE_TIME ? 1 : item.quantity,
				priceAtAdd: item.priceAtAdd,
			};
		});

		const totalPrice = items.reduce((sum, item) => {
			const price =
				item.plan === SubscriptionPlan.MONTHLY
					? item.appId.subscriptionPrice || item.priceAtAdd
					: item.appId.price || item.priceAtAdd;
			return sum + price * item.quantity;
		}, 0);

		return {
			_id: cart._id?.toString() ?? "",
			user: {
				_id:
					typeof cart.user === "object" && cart.user !== null && "_id" in cart.user
						? String(cart.user._id)
						: String(cart.user ?? ""),
				fullName:
					typeof cart.user === "object" && cart.user !== null && "fullName" in cart.user
						? String(cart.user.fullName ?? "")
						: "",
				email:
					typeof cart.user === "object" && cart.user !== null && "email" in cart.user
						? String(cart.user.email ?? "")
						: "",
				avatarUrl:
					typeof cart.user === "object" && cart.user !== null && "avatarUrl" in cart.user
						? (cart.user.avatarUrl as string | undefined)
						: undefined,
			},
			items,
			totalPrice,
			createdAt: cart.createdAt?.toISOString(),
			updatedAt: cart.updatedAt?.toISOString(),
		};
	}
}
