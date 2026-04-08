import type { CartItemType, ICart, SubscriptionPlan } from "./carts.types";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export interface ICartRepository {
	// User cart operations
	findByUserId(user: string): Promise<ICart | null>;
	createCart(user: string): Promise<ICart>;
	addItem(
		user: string,
		app: string,
		itemType: CartItemType,
		quantity: number,
		price: number,
		plan?: SubscriptionPlan,
	): Promise<ICart | null>;
	updateItem(
		user: string,
		app: string,
		data: { quantity?: number; plan?: SubscriptionPlan },
	): Promise<ICart | null>;
	removeItem(user: string, app: string): Promise<ICart | null>;
	clearCart(user: string): Promise<boolean>;

	// Admin operations
	findAllPaginated(
		page: number,
		limit: number,
	): Promise<{ carts: ICart[]; total: number }>;
	deleteCart(id: string): Promise<boolean>;
	deleteCartByUserId(user: string): Promise<boolean>;
}

export class CartsRepository implements ICartRepository {
	private get db() {
		// biome-ignore lint/style/noNonNullAssertion: initialized on app bootstrap
		return mongoose.connection.db!;
	}

	private get collection() {
		return this.db.collection<ICart>("carts");
	}

	private async populateCart(cart: ICart | null): Promise<ICart | null> {
		if (!cart) return null;
		const userId = typeof cart.user === "object" && "_id" in cart.user ? cart.user._id : cart.user;
		const appIds = cart.items
			.map((item) => (typeof item.app === "object" && "_id" in item.app ? item.app._id : item.app))
			.filter((id): id is ObjectId => typeof id === "object");

		const [user, apps] = await Promise.all([
			this.db
				.collection("users")
				.findOne({ _id: userId }, { projection: { _id: 1, fullName: 1, email: 1, avatarUrl: 1 } }),
			appIds.length
				? this.db
						.collection("apps")
						.find({ _id: { $in: appIds } }, { projection: { _id: 1, name: 1, iconUrl: 1, price: 1 } })
						.toArray()
				: Promise.resolve([]),
		]);

		const appMap = new Map(apps.map((a) => [a._id.toString(), a]));
		const populatedItems = cart.items.map((item) => {
			const appId = typeof item.app === "object" && "_id" in item.app ? item.app._id : item.app;
			const app = appMap.get(appId.toString());
			return {
				...item,
				app: app
					? {
							_id: app._id,
							name: typeof app.name === "string" ? app.name : "",
							iconUrl: typeof app.iconUrl === "string" ? app.iconUrl : "",
							price: typeof app.price === "number" ? app.price : item.priceAtAdd,
						}
					: item.app,
			};
		});

		return {
			...cart,
			user: user
				? {
						_id: user._id,
						fullName: typeof user.fullName === "string" ? user.fullName : "",
						email: typeof user.email === "string" ? user.email : "",
						avatarUrl: typeof user.avatarUrl === "string" ? user.avatarUrl : undefined,
					}
				: cart.user,
			items: populatedItems,
		};
	}

	async findByUserId(user: string): Promise<ICart | null> {
		if (!ObjectId.isValid(user)) return null;
		const cart = await this.collection.findOne({
			user: new ObjectId(user) as unknown as ICart["user"],
		});
		return this.populateCart(cart);
	}

	async createCart(user: string): Promise<ICart> {
		if (!ObjectId.isValid(user)) {
			throw new Error("Invalid user id");
		}
		const now = new Date();
		const doc: ICart = {
			user: new ObjectId(user) as unknown as ICart["user"],
			items: [],
			createdAt: now,
			updatedAt: now,
		};
		const result = await this.collection.insertOne(doc);
		return {
			...doc,
			_id: result.insertedId as unknown as ICart["_id"],
		};
	}

	async addItem(
		user: string,
		app: string,
		itemType: CartItemType,
		quantity: number,
		price: number,
		plan?: SubscriptionPlan,
	): Promise<ICart | null> {
		if (!ObjectId.isValid(user) || !ObjectId.isValid(app)) return null;

		const userId = new ObjectId(user);
		const appId = new ObjectId(app);
		let cart = await this.collection.findOne({
			user: userId as unknown as ICart["user"],
		});
		if (!cart) {
			cart = await this.createCart(user);
		}

		const items = [...cart.items];
		const existingIdx = items.findIndex((item) => {
			const appValue = typeof item.app === "object" && "_id" in item.app ? item.app._id : item.app;
			const appIdStr = typeof appValue === "object" ? appValue.toString() : String(appValue);
			return appIdStr === app && item.itemType === itemType && (item.plan ?? null) === (plan ?? null);
		});

		if (existingIdx >= 0) {
			const existingItem = items[existingIdx];
			if (!existingItem) return null;
			items[existingIdx] = {
				...existingItem,
				quantity:
					existingItem.itemType === "one_time"
						? 1
						: existingItem.quantity + quantity,
			};
		} else {
			items.push({
				app: appId as unknown as ICart["items"][number]["app"],
				itemType,
				plan: plan ?? null,
				quantity: itemType === "one_time" ? 1 : quantity,
				priceAtAdd: price,
			});
		}

		const cartId = cart._id;
		if (!cartId) return null;
		await this.collection.updateOne(
			{ _id: cartId },
			{ $set: { items, updatedAt: new Date() } },
		);
		const updated = await this.collection.findOne({ _id: cartId });
		return this.populateCart(updated);
	}

	async updateItem(
		user: string,
		app: string,
		data: { quantity?: number; plan?: SubscriptionPlan },
	): Promise<ICart | null> {
		if (!ObjectId.isValid(user)) return null;
		const cart = await this.findByUserId(user);
		if (!cart) return null;

		const items = cart.items.map((item) => {
			const appValue = typeof item.app === "object" && "_id" in item.app ? item.app._id : item.app;
			const appIdStr = typeof appValue === "object" ? appValue.toString() : String(appValue);
			if (appIdStr !== app) return item;
			return {
				...item,
				quantity:
					item.itemType === "one_time" ? 1 : (data.quantity ?? item.quantity),
				plan: data.plan ?? item.plan,
			};
		});

		const hasMatched = items.some((item) => {
			const appValue = typeof item.app === "object" && "_id" in item.app ? item.app._id : item.app;
			const appIdStr = typeof appValue === "object" ? appValue.toString() : String(appValue);
			return appIdStr === app;
		});
		if (!hasMatched) return null;

		const cartId = cart._id;
		if (!cartId) return null;
		await this.collection.updateOne(
			{ _id: cartId },
			{ $set: { items, updatedAt: new Date() } },
		);
		const updated = await this.collection.findOne({ _id: cartId });
		return this.populateCart(updated);
	}

	async removeItem(user: string, app: string): Promise<ICart | null> {
		if (!ObjectId.isValid(user)) return null;
		const cart = await this.findByUserId(user);
		if (!cart) return null;

		const originalCount = cart.items.length;
		const items = cart.items.filter((item) => {
			const appValue = typeof item.app === "object" && "_id" in item.app ? item.app._id : item.app;
			const appIdStr = typeof appValue === "object" ? appValue.toString() : String(appValue);
			return appIdStr !== app;
		});
		if (items.length === originalCount) return null;

		const cartId = cart._id;
		if (!cartId) return null;
		await this.collection.updateOne(
			{ _id: cartId },
			{ $set: { items, updatedAt: new Date() } },
		);
		const updated = await this.collection.findOne({ _id: cartId });
		return this.populateCart(updated);
	}

	async clearCart(user: string): Promise<boolean> {
		if (!ObjectId.isValid(user)) return false;
		const result = await this.collection.updateOne(
			{ user: new ObjectId(user) as unknown as ICart["user"] },
			{ $set: { items: [], updatedAt: new Date() } },
		);
		return result.matchedCount > 0;
	}

	async findAllPaginated(
		page: number,
		limit: number,
	): Promise<{ carts: ICart[]; total: number }> {
		const safePage = Math.max(1, page);
		const safeLimit = Math.max(1, Math.min(100, limit));
		const skip = (safePage - 1) * safeLimit;
		const [carts, total] = await Promise.all([
			this.collection.find({}).sort({ updatedAt: -1 }).skip(skip).limit(safeLimit).toArray(),
			this.collection.countDocuments({}),
		]);
		const populatedCarts = (await Promise.all(carts.map((cart) => this.populateCart(cart)))).filter(
			(cart): cart is ICart => Boolean(cart),
		);
		return { carts: populatedCarts, total };
	}

	async deleteCart(id: string): Promise<boolean> {
		if (!ObjectId.isValid(id)) return false;
		const result = await this.collection.deleteOne({
			_id: new ObjectId(id) as unknown as ICart["_id"],
		});
		return result.deletedCount > 0;
	}

	async deleteCartByUserId(user: string): Promise<boolean> {
		if (!ObjectId.isValid(user)) return false;
		const result = await this.collection.deleteOne({
			user: new ObjectId(user) as unknown as ICart["user"],
		});
		return result.deletedCount > 0;
	}
}
