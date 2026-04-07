export interface FileRecord {
	_id: string;
	uploaderId: string;
	url: string;
	fileKey: string;
	mimeType: string;
	size: number;
	createdAt: Date;
}

export interface CreateFileDTO {
	uploaderId: string;
	url: string;
	fileKey: string;
	mimeType: string;
	size: number;
}

export interface FileQueryDTO {
	uploaderId?: string;
	mimeType?: string;
}