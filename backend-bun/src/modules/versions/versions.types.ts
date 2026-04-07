export type Platform =
	| "android"
	| "ios"
	| "windows"
	| "macos"
	| "linux"
	| "web";

export type VersionStatus = "draft" | "published" | "deprecated" | "archived";

export type SubscriptionTier = "premium" | "pro" | null;

export interface VersionFile {
	platform: Platform;
	fileKey: string;
	fileName: string;
	fileSize: number;
	mimeType: string;
	checksum?: string;
}

export interface AccessControl {
	isFree: boolean;
	requiresPurchase: boolean;
	requiredSubscription: SubscriptionTier;
	allowedRoles: string[];
	allowedUserIds: string[];
}

export interface Version {
	_id: string;
	appId: string;
	versionNumber: string;
	versionCode: number;
	releaseName?: string;
	changelog?: string;
	files: VersionFile[];
	accessControl: AccessControl;
	status: VersionStatus;
	isLatest: boolean;
	publishedAt?: Date;
	downloadCount: number;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateVersionDTO {
	appId: string;
	versionNumber: string;
	versionCode: number;
	releaseName?: string;
	changelog?: string;
	files: VersionFile[];
	accessControl?: Partial<AccessControl>;
	status?: VersionStatus;
	isLatest?: boolean;
}

export interface UpdateVersionDTO {
	versionNumber?: string;
	versionCode?: number;
	releaseName?: string;
	changelog?: string;
	files?: VersionFile[];
	accessControl?: Partial<AccessControl>;
	status?: VersionStatus;
	isLatest?: boolean;
}

export interface VersionQueryDTO {
	appId?: string;
	status?: VersionStatus;
	platform?: Platform;
	isLatest?: boolean;
	page?: number;
	limit?: number;
}

export interface VersionWithApp extends Version {
	app?: {
		_id: string;
		name: string;
		slug: string;
	};
}
