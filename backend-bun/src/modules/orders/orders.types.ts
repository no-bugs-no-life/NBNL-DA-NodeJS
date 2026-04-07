import type { ObjectId } from "mongoose";

export enum OrderStatus {
	PENDING = "pending",
	PROCESSING = "processing",
	COMPLETED = "completed",
	FAILED = "failed",
	CANCELLED = "cancelled",
}

export enum PaymentMethod {
	MOMO = "momo",
	PAYPAL = "paypal",
	COIN = "coin",
	CARD = "card",
}

export interface OrderItem {
	app: ObjectId;
	name: string;
	price: number;
	iconUrl?: string;
}

export interface IOrder {
	_id?: ObjectId;
	user: ObjectId;
	items: OrderItem[];
	totalAmount: number;
	discountAmount: number;
	finalAmount: number;
	couponCode?: string;
	status: OrderStatus;
	paymentMethod: PaymentMethod;
	paymentId?: string;
	paidAt?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IOrderPublic {
	id: string;
	user: string;
	items: OrderItemPublic[];
	totalAmount: number;
	discountAmount: number;
	finalAmount: number;
	couponCode?: string;
	status: OrderStatus;
	paymentMethod: PaymentMethod;
	paymentId?: string;
	paidAt?: Date;
	createdAt: Date;
}

export interface OrderItemPublic {
	app: string;
	name: string;
	price: number;
	iconUrl?: string;
}

export interface IOrderCreate {
	items: { app: string; name: string; price: number; iconUrl?: string }[];
	couponCode?: string;
	paymentMethod: PaymentMethod;
}

export interface OrderQuery {
	page?: number;
	limit?: number;
	status?: OrderStatus;
	paymentMethod?: PaymentMethod;
}
