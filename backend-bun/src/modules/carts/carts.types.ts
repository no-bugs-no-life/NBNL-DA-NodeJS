import { ObjectId } from "mongoose";

export interface CartItem {
	appId: ObjectId;
	priceAtAdded: number;
	addedAt: Date;
}

export interface ICart {
	_id?: ObjectId;
	userId: ObjectId;
	items: CartItem[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ICartPublic {
	id: string;
	userId: string;
	items: CartItemPublic[];
	totalItems: number;
	totalAmount: number;
}

export interface CartItemPublic {
	appId: string;
	priceAtAdded: number;
	addedAt: Date;
}