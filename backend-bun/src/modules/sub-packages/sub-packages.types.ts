export interface SubPackage {
	_id: string;
	name: string;
	app: string | null;
	type: SubPackageType;
	price: number;
	durationDays: number;
	description: string;
	isActive: boolean;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type SubPackageType = "monthly" | "yearly" | "lifetime";

export interface CreateSubPackageDTO {
	name: string;
	app?: string | null;
	type: SubPackageType;
	price: number;
	durationDays: number;
	description?: string;
}

export interface UpdateSubPackageDTO {
	name?: string;
	type?: SubPackageType;
	price?: number;
	durationDays?: number;
	description?: string;
	isActive?: boolean;
}
