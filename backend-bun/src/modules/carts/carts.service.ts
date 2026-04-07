import { badRequest, notFound } from "@/shared/errors";
import { CartsRepository } from "./carts.repository";
import type {
	CartAppItem,
	CartItemResponse,
	CartItemType,
	CartResponse,
	ICart,
	PaginatedCartsResponse,
	SubscriptionPlan,
} from "./carts.types";

export class CartsService {
	private readonly repository = new CartsRepository();

	// User: Get own cart
	async getUserCart(userId: string): Promise<CartResponse | null> {
		const cart = await this.repository.findByUserId(userId);
		if (!cart) {
			// Create empty cart if not exists
			const newCart = await this.repository.createCart(userId);
			return this.toResponse(newCart);
		}
		return this.toResponse(cart);
	}

	// User: Add item to cart
	async addItem(
		userId: string,
		appId: string,
		itemType: CartItemType = CartItemType.ONE_TIME,
		quantity: number = 1,
		plan?: SubscriptionPlan,
	): Promise<CartResponse> {
		// TODO: Get app price from AppsRepository
		const price = 0; // Placeholder - should fetch from apps collection

		const cart = await this.repository.addItem(
			userId,
			appId,
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
		userId: string,
		appId: string,
		data: { quantity?: number; plan?: SubscriptionPlan },
	): Promise<CartResponse> {
		const cart = await this.repository.updateItem(userId, appId, data);
		if (!cart) throw notFound("Sản phẩm không có trong giỏ hàng");
		return this.toResponse(cart);
	}

	// User: Remove item from cart
	async removeItem(userId: string, appId: string): Promise<CartResponse> {
		const cart = await this.repository.removeItem(userId, appId);
		if (!cart) throw notFound("Sản phẩm không có trong giỏ hàng");
		return this.toResponse(cart);
	}

	// User: Clear cart
	async clearCart(userId: string): Promise<boolean> {
		return this.repository.clearCart(userId);
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
		userId: string,
		appId: string,
		itemType: CartItemType,
	): Promise<CartResponse> {
		const cart = await this.repository.addItem(userId, appId, itemType, 1, 0);
		if (!cart) throw badRequest("Không thể tạo giỏ hàng");
		return this.toResponse(cart);
	}

	// Admin: Delete cart by ID
	async deleteCart(id: string): Promise<boolean> {
		return this.repository.deleteCart(id);
	}

	// Admin: Delete cart by userId
	async deleteCartByUserId(userId: string): Promise<boolean> {
		return this.repository.deleteCartByUserId(userId);
	}

	private toResponse(cart: ICart): CartResponse {
		const items: CartItemResponse[] = cart.items.map((item) => {
			const appData =
				typeof item.appId === "object" && "_id" in item.appId
					? (item.appId as CartAppItem)
					: { _id: item.appId, name: "", iconUrl: "", price: item.priceAtAdd };

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
				itemType: item.itemType,
				plan: item.plan,
				quantity: item.quantity,
				priceAtAdd: item.priceAtAdd,
			};
		});

		const totalPrice = items.reduce((sum, item) => {
			const price =
				item.plan === SubscriptionPlan.MONTHLY
					? item.appId.subscriptionPrice || item.priceAtAdd
					: item.priceAtAdd;
			return sum + price * item.quantity;
		}, 0);

		return {
			_id: cart._id?.toString() ?? "",
			user: {
				_id:
					typeof cart.userId === "object"
						? cart.userId.toString()
						: cart.userId,
				fullName: cart.user?.fullName,
				email: cart.user?.email || "",
				avatarUrl: cart.user?.avatarUrl,
			},
			items,
			totalPrice,
			createdAt: cart.createdAt?.toISOString(),
			updatedAt: cart.updatedAt?.toISOString(),
		};
	}
}
