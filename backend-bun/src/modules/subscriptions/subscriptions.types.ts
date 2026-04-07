export interface Subscription {
	_id: string;
	userId: string;
	appId: string;
	subPackageId: string;
	status: SubscriptionStatus;
	startDate: Date;
	endDate: Date;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface CreateSubscriptionDTO {
	userId: string;
	appId: string;
	subPackageId: string;
	startDate: Date;
	endDate: Date;
}

export interface UpdateSubscriptionDTO {
	status?: SubscriptionStatus;
	endDate?: Date;
	subPackageId?: string;
}

export interface SubscriptionQueryDTO {
	userId?: string;
	appId?: string;
	subPackageId?: string;
	status?: SubscriptionStatus;
}

// Populated types for API responses (matching frontend)
export interface UserInfo {
	_id: string;
	fullName: string;
	email: string;
	avatarUrl?: string;
}

export interface AppInfo {
	_id: string;
	name: string;
	iconUrl?: string;
}

export interface PackageInfo {
	_id: string;
	name: string;
	type: "monthly" | "yearly" | "lifetime";
	price: number;
	durationDays: number;
}

export interface SubscriptionWithRelations {
	_id: string;
	userId: UserInfo;
	appId: AppInfo;
	packageId: PackageInfo;
	startDate: string;
	endDate: string;
	status: SubscriptionStatus;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface RenewSubscriptionDTO {
	packageId: string;
}
