import type { ObjectId } from "mongoose";

export enum DiscountType {
	PERCENTAGE = "percentage",
	FIXED = "fixed",
}

export interface AppInfo {
	_id: ObjectId;
	name: string;
	iconUrl?: string;
}

export interface ICoupon {
	_id?: ObjectId;
	code: string;
	discountType: DiscountType;
	discountValue: number;
	startDate: Date;
	endDate: Date;
	usageLimit: number;
	usedCount: number;
	apps: ObjectId[];
	isGlobal: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

// API Response Types - matching frontend
export interface CouponItemResponse {
	_id: string;
	code: string;
	discountType: DiscountType;
	discountValue: number;
	startDate: string;
	endDate: string;
	usageLimit: number;
	usedCount: number;
	apps: AppInfo[];
	createdAt: string;
}

export interface PaginatedCouponsResponse {
	docs: CouponItemResponse[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
}

export interface CreateCouponDTO {
	code: string;
	discountType: DiscountType;
	discountValue: number;
	startDate: string;
	endDate: string;
	usageLimit?: number;
	apps?: string[];
}

export interface UpdateCouponDTO {
	discountType?: DiscountType;
	discountValue?: number;
	startDate?: string;
	endDate?: string;
	usageLimit?: number;
	apps?: string[];
}
