import type { ICart, CartItem } from "./carts.types";
import { ObjectId } from "mongoose";

export interface ICartRepository {
	findByUserId(userId: string): Promise<ICart | null>;
	addItem(userId: string, item: CartItem): Promise<ICart | null>;
	updateItem(userId: string, appId: string, data: Partial<CartItem>): Promise<ICart | null>;
	removeItem(userId: string, appId: string): Promise<ICart | null>;
	clearCart(userId: string): Promise<boolean>;
}

export class CartsRepository implements ICartRepository {
	async findByUserId(userId: string): Promise<ICart | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async addItem(userId: string, item: CartItem): Promise<ICart | null> {
		// TODO: Implement with MongoDB - upsert item, update price if exists
		return null;
	}

	async updateItem(userId: string, appId: string, data: Partial<CartItem>): Promise<ICart | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async removeItem(userId: string, appId: string): Promise<ICart | null> {
		// TODO: Implement with MongoDB - pull item from array
		return null;
	}

	async clearCart(userId: string): Promise<boolean> {
		// TODO: Implement with MongoDB - delete cart or clear items
		return false;
	}
}
