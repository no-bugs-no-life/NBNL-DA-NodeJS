import { AppError } from "@/shared/errors";
import { CacheHelper } from "@/infra/cache/redis";
import { OrdersRepository } from "@/modules/orders/orders.repository";
import { VersionsRepository } from "./versions.repository";
import type {
	CreateVersionDTO,
	Platform,
	UpdateVersionDTO,
	Version,
	VersionQueryDTO,
} from "./versions.types";

export interface DownloadPermission {
	allowed: boolean;
	reason:
		| "free"
		| "role_whitelist"
		| "user_whitelist"
		| "purchased"
		| "purchase_required"
		| "version_not_found"
		| "platform_not_supported";
	file?: {
		fileName: string;
		fileSize: number;
		mimeType: string;
		checksum?: string;
		fileKey: string;
	};
	app?: string;
}

export class VersionsService {
	private repo: VersionsRepository;
	private readonly ordersRepo = new OrdersRepository();

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

	async findByAppId(app: string): Promise<Version[]> {
		return this.repo.findByAppId(app);
	}

	async findLatestByAppId(app: string): Promise<Version | null> {
		return this.repo.findLatestByAppId(app);
	}

	async findByPlatform(app: string, platform: Platform): Promise<Version[]> {
		return this.repo.findByPlatform(app, platform);
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

	async revokeDownloadLink(id: string): Promise<Version> {
		return this.update(id, {
			status: "deprecated",
			isLatest: false,
		});
	}

	async archive(id: string): Promise<Version> {
		return this.update(id, { status: "archived" });
	}

	async markAsLatest(id: string, _app: string): Promise<Version> {
		await this.findById(id);
		return this.repo.update(id, { isLatest: true });
	}

	async incrementDownloadCount(id: string): Promise<Version | null> {
		return this.repo.incrementDownloadCount(id);
	}

	private buildDownloadCacheKey(downloadId: string): string {
		return `downloads:${downloadId}`;
	}

	private createDownloadId(): string {
		return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
	}

	private async createDownloadLink(userId: string, fileKey: string): Promise<string> {
		const downloadId = this.createDownloadId();
		await CacheHelper.set(
			this.buildDownloadCacheKey(downloadId),
			{
				downloadId,
				userId,
				fileKey,
			},
			300,
		);
		return `/downloads/${downloadId}`;
	}

	async getDownloadLink(downloadId: string): Promise<{ userId: string; fileKey: string } | null> {
		return CacheHelper.get<{ userId: string; fileKey: string }>(
			this.buildDownloadCacheKey(downloadId),
		);
	}

	async hasPurchasedVersionApp(userId: string, versionId: string): Promise<boolean> {
		const version = await this.findById(versionId);
		const orders = await this.ordersRepo.findByUserId(userId);
		return orders.some(
			(order) =>
				order.status === "completed" &&
				order.items.some((item) => item.app.toString() === version.app),
		);
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
		user?: string,
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

		if (user && version.accessControl.allowedUserIds.includes(user)) {
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
			app: version.app,
		};
	}

	/**
	 * Get download info với file metadata
	 */
	async getDownloadInfo(
		versionId: string,
		platform: Platform,
		user?: string,
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
		const permission = await this.checkDownloadPermission(
			versionId,
			platform,
			user,
			userRole,
			hasPurchased,
		);

		if (!permission.allowed) {
			throw AppError.forbidden(`Download denied: ${permission.reason}`, {
				code: permission.reason,
				app: permission.app,
			} as Record<string, unknown>);
		}

		const downloadUrl = await this.createDownloadLink(
			user || "",
			permission.file?.fileKey || "",
		);
		const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

		return {
			fileName: permission.file?.fileName,
			fileSize: permission.file?.fileSize,
			mimeType: permission.file?.mimeType,
			checksum: permission.file?.checksum,
			downloadUrl,
			expiresAt,
			reason: permission.reason,
		};
	}

	async getLatestDownloadInfoByApp(
		appId: string,
		platform: Platform,
		userId: string,
		userRole?: string,
	) {
		const latest = await this.repo.findLatestByAppId(appId);
		if (!latest) throw AppError.notFound("Version not found");
		const hasPurchased = await this.hasPurchasedVersionApp(userId, latest._id.toString());
		return this.getDownloadInfo(
			latest._id.toString(),
			platform,
			userId,
			userRole,
			hasPurchased,
		);
	}
}
