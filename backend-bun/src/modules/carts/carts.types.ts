import type { ObjectId } from "mongodb";

export enum CartItemType {
	ONE_TIME = "one_time",
	SUBSCRIPTION = "subscription",
}

export enum SubscriptionPlan {
	MONTHLY = "monthly",
	YEARLY = "yearly",
}

export interface CartAppItem {
	_id: ObjectId;
	name: string;
	iconUrl?: string;
	price: number;
	subscriptionPrice?: number;
}

export interface CartItemData {
	_id?: ObjectId;
	app: ObjectId | CartAppItem;
	itemType: CartItemType;
	plan?: SubscriptionPlan | null;
	quantity: number;
	priceAtAdd: number;
}

export interface ICartItem {
	_id?: ObjectId;
	app: ObjectId | CartAppItem;
	itemType: CartItemType;
	plan?: SubscriptionPlan | null;
	quantity: number;
	priceAtAdd: number;
	createdAt?: Date;
}

export interface ICart {
	_id?: ObjectId;
	user: ObjectId | {
		_id: ObjectId;
		fullName?: string;
		email: string;
		avatarUrl?: string;
	};
	items: ICartItem[];
	createdAt?: Date;
	updatedAt?: Date;
}

// API Response Types - matching frontend
export interface CartItemResponse {
	_id: string;
	appId: {
		_id: string;
		name: string;
		iconUrl: string;
		price: number;
		subscriptionPrice?: number;
	};
	app?: {
		_id: string;
		name: string;
		iconUrl: string;
		price: number;
		subscriptionPrice?: number;
	};
	itemType: CartItemType;
	plan?: SubscriptionPlan | null;
	quantity: number;
	priceAtAdd: number;
}

export interface CartResponse {
	_id: string;
	user: {
		_id: string;
		fullName?: string;
		email: string;
		avatarUrl?: string;
	};
	items: CartItemResponse[];
	totalPrice: number;
	createdAt?: string;
	updatedAt?: string;
}

// Pagination Response
export interface PaginatedCartsResponse {
	docs: CartResponse[];
	totalPages: number;
	totalDocs: number;
	page: number;
	limit: number;
}

// Create/Update DTOs
export interface AddToCartDTO {
	app: string;
	itemType?: CartItemType;
	plan?: SubscriptionPlan;
	quantity?: number;
}

export interface UpdateCartItemDTO {
	quantity?: number;
	plan?: SubscriptionPlan;
}
