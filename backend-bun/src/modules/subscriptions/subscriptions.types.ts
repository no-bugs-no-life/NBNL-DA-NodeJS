export interface Subscription {
	_id: string;
	userId: string;
	subPackageId: string;
	status: SubscriptionStatus;
	startDate: Date;
	endDate: Date;
	createdAt: Date;
	updatedAt: Date;
}

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface CreateSubscriptionDTO {
	userId: string;
	subPackageId: string;
	startDate: Date;
	endDate: Date;
}

export interface UpdateSubscriptionDTO {
	status?: SubscriptionStatus;
	endDate?: Date;
}

export interface SubscriptionQueryDTO {
	userId?: string;
	subPackageId?: string;
	status?: SubscriptionStatus;
}

export interface SubscriptionWithPackage extends Subscription {
	package?: {
		_id: string;
		name: string;
		type: string;
		price: number;
	};
}