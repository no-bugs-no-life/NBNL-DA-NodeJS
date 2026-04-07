import { ObjectId } from "mongoose";

export enum DiscountType {
	PERCENTAGE = "percentage",
	FIXED = "fixed",
}

export enum CouponStatus {
	ACTIVE = "active",
	EXPIRED = "expired",
	DISABLED = "disabled",
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
	appIds: ObjectId[];
	isGlobal: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ICouponPublic {
	id: string;
	code: string;
	discountType: DiscountType;
	discountValue: number;
	startDate: Date;
	endDate: Date;
	usageLimit: number;
	usedCount: number;
	isGlobal: boolean;
	isExpired: boolean;
	isUsable: boolean;
}

export interface ICouponCreate {
	code: string;
	discountType: DiscountType;
	discountValue: number;
	startDate: Date;
	endDate: Date;
	usageLimit: number;
	appIds?: string[];
}

export interface ICouponUpdate {
	discountValue?: number;
	startDate?: Date;
	endDate?: Date;
	usageLimit?: number;
	isActive?: boolean;
}

export interface CouponQuery {
	page?: number;
	limit?: number;
	search?: string;
	status?: CouponStatus;
	isGlobal?: boolean;
}