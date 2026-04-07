import { AppError } from "@/shared/errors";
import type { Version, CreateVersionDTO, UpdateVersionDTO, VersionQueryDTO, Platform } from "./versions.types";
import { VersionsRepository } from "./versions.repository";

export interface DownloadPermission {
	allowed: boolean;
	reason: "free" | "role_whitelist" | "user_whitelist" | "purchased" | "purchase_required" | "version_not_found" | "platform_not_supported";
	file?: {
		fileName: string;
		fileSize: number;
		mimeType: string;
		checksum?: string;
		fileKey: string;
	};
	appId?: string;
}

export class VersionsService {
	private repo: VersionsRepository;

	constructor(repo?: VersionsRepository) {
		this.repo = repo || new VersionsRepository();
	}

	async findAll(query: VersionQueryDTO) {
		return this.repo.findAll(query);
	}

	async findById(id: string): Promise<Version> {
		const version = await this.repo.findById(id);
		if (!version) throw AppError.notFound("Version not found");
		return version;
	}

	async findByAppId(appId: string): Promise<Version[]> {
		return this.repo.findByAppId(appId);
	}

	async findLatestByAppId(appId: string): Promise<Version | null> {
		return this.repo.findLatestByAppId(appId);
	}

	async findByPlatform(appId: string, platform: Platform): Promise<Version[]> {
		return this.repo.findByPlatform(appId, platform);
	}

	async create(data: CreateVersionDTO): Promise<Version> {
		return this.repo.create(data);
	}

	async update(id: string, data: UpdateVersionDTO): Promise<Version> {
		await this.findById(id);
		const updated = await this.repo.update(id, data);
		if (!updated) throw AppError.notFound("Version not found");
		return updated;
	}

	async delete(id: string): Promise<void> {
		await this.findById(id);
		const deleted = await this.repo.delete(id);
		if (!deleted) throw AppError.internal("Failed to delete version");
	}

	async publish(id: string): Promise<Version> {
		return this.update(id, { status: "published", publishedAt: new Date() });
	}

	async deprecate(id: string): Promise<Version> {
		return this.update(id, { status: "deprecated" });
	}

	async archive(id: string): Promise<Version> {
		return this.update(id, { status: "archived" });
	}

	async markAsLatest(id: string, appId: string): Promise<Version> {
		await this.findById(id);
		return this.repo.update(id, { isLatest: true });
	}

	async incrementDownloadCount(id: string): Promise<Version | null> {
		return this.repo.incrementDownloadCount(id);
	}

	/**
	 * Check download permission cho user
	 * Logic:
	 * 1. Free app → cho phép
	 * 2. Role/User whitelist → cho phép
	 * 3. Đã mua app → cho phép
	 * 4. Ngược lại → từ chối
	 */
	async checkDownloadPermission(
		versionId: string,
		platform: Platform,
		userId?: string,
		userRole?: string,
		hasPurchased?: boolean,
	): Promise<DownloadPermission> {
		const version = await this.repo.findById(versionId);

		if (!version || version.status !== "published" || version.isDeleted) {
			return { allowed: false, reason: "version_not_found" };
		}

		const file = version.files.find((f) => f.platform === platform);
		if (!file) {
			return { allowed: false, reason: "platform_not_supported" };
		}

		// Case 1: Version/App miễn phí
		if (version.accessControl.isFree) {
			return {
				allowed: true,
				reason: "free",
				file: {
					fileName: file.fileName,
					fileSize: file.fileSize,
					mimeType: file.mimeType,
					checksum: file.checksum,
					fileKey: file.fileKey,
				},
			};
		}

		// Case 2: User là admin/developer/tester được whitelist
		if (userRole && version.accessControl.allowedRoles.includes(userRole)) {
			return {
				allowed: true,
				reason: "role_whitelist",
				file: {
					fileName: file.fileName,
					fileSize: file.fileSize,
					mimeType: file.mimeType,
					checksum: file.checksum,
					fileKey: file.fileKey,
				},
			};
		}

		if (userId && version.accessControl.allowedUserIds.includes(userId)) {
			return {
				allowed: true,
				reason: "user_whitelist",
				file: {
					fileName: file.fileName,
					fileSize: file.fileSize,
					mimeType: file.mimeType,
					checksum: file.checksum,
					fileKey: file.fileKey,
				},
			};
		}

		// Case 3: User đã mua app
		if (hasPurchased) {
			return {
				allowed: true,
				reason: "purchased",
				file: {
					fileName: file.fileName,
					fileSize: file.fileSize,
					mimeType: file.mimeType,
					checksum: file.checksum,
					fileKey: file.fileKey,
				},
			};
		}

		// Case 4: Từ chối
		return {
			allowed: false,
			reason: "purchase_required",
			appId: version.appId,
		};
	}

	/**
	 * Get download info với file metadata
	 */
	async getDownloadInfo(
		versionId: string,
		platform: Platform,
		userId?: string,
		userRole?: string,
		hasPurchased?: boolean,
	): Promise<{
		fileName: string;
		fileSize: number;
		mimeType: string;
		checksum?: string;
		downloadUrl: string;
		expiresAt: Date;
		reason: string;
	}> {
		const permission = await this.checkDownloadPermission(versionId, platform, userId, userRole, hasPurchased);

		if (!permission.allowed) {
			throw AppError.forbidden(`Download denied: ${permission.reason}`, {
				code: permission.reason,
				appId: permission.appId,
			} as Record<string, unknown>);
		}

		const version = await this.findById(versionId);

		// Generate download token (10 phút)
		const token = this.generateDownloadToken(versionId, platform, permission.file!.fileKey);
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

		return {
			fileName: permission.file!.fileName,
			fileSize: permission.file!.fileSize,
			mimeType: permission.file!.mimeType,
			checksum: permission.file!.checksum,
			downloadUrl: `/api/versions/download/${versionId}?token=${token}&platform=${platform}`,
			expiresAt,
			reason: permission.reason,
		};
	}

	/**
	 * Generate short-lived download token
	 */
	private generateDownloadToken(versionId: string, platform: Platform, fileKey: string): string {
		const payload = {
			versionId,
			platform,
			fileKey,
			exp: Math.floor(Date.now() / 1000) + 600, // 10 minutes
		};
		// Simple base64 encoding for demo - in production use JWT
		return Buffer.from(JSON.stringify(payload)).toString("base64url");
	}

	/**
	 * Verify download token
	 */
	verifyDownloadToken(token: string): { versionId: string; platform: Platform; fileKey: string } | null {
		try {
			const payload = JSON.parse(Buffer.from(token, "base64url").toString());
			if (payload.exp < Math.floor(Date.now() / 1000)) {
				return null; // Token expired
			}
			return {
				versionId: payload.versionId,
				platform: payload.platform,
				fileKey: payload.fileKey,
			};
		} catch {
			return null;
		}
	}
}