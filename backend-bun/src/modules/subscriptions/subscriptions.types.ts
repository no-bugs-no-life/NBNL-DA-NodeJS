export interface Subscription {
	_id: string;
	user: string;
	app: string;
	subPackage: string;
	status: SubscriptionStatus;
	startDate: Date;
	endDate: Date;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface CreateSubscriptionDTO {
	user: string;
	app: string;
	subPackage: string;
	startDate: Date;
	endDate: Date;
}

export interface UpdateSubscriptionDTO {
	status?: SubscriptionStatus;
	endDate?: Date;
	subPackage?: string;
}

export interface SubscriptionQueryDTO {
	user?: string;
	app?: string;
	subPackage?: string;
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
	user: UserInfo;
	app: AppInfo;
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
