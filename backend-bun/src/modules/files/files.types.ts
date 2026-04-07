export type OwnerType = "app" | "user" | "developer";
export type FileType =
	| "apk"
	| "ipa"
	| "icon"
	| "banner"
	| "screenshot"
	| "avatar"
	| "other";

export interface IFile {
	_id: string;
	ownerType: OwnerType;
	ownerId: string;
	fileType: FileType;
	url: string;
	size: number;
	mimeType?: string;
	fileKey?: string;
	uploader?: string;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface FilePublic {
	_id: string;
	ownerType: OwnerType;
	ownerId: string;
	fileType: FileType;
	url: string;
	size: number;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface PaginatedFiles {
	docs: FilePublic[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
}

export const toPublicFile = (f: IFile): FilePublic => ({
	_id: f._id,
	ownerType: f.ownerType,
	ownerId: f.ownerId,
	fileType: f.fileType,
	url: f.url,
	size: f.size,
	isDeleted: f.isDeleted,
	createdAt: f.createdAt,
	updatedAt: f.updatedAt,
});
