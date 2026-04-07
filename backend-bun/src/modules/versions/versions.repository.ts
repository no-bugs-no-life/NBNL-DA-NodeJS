import mongoose from "mongoose";
import type {
	AccessControl,
	CreateVersionDTO,
	Platform,
	UpdateVersionDTO,
	Version,
	VersionFile,
	VersionQueryDTO,
} from "./versions.types";

const COLLECTION = "versions";

const versionFileSchema = new mongoose.Schema<VersionFile>(
	{
		platform: {
			type: String,
			enum: ["android", "ios", "windows", "macos", "linux", "web"],
			required: true,
		},
		fileKey: { type: String, required: true },
		fileName: { type: String, required: true },
		fileSize: { type: Number, required: true, min: 0 },
		mimeType: { type: String, default: "application/octet-stream" },
		checksum: { type: String },
	},
	{ _id: false },
);

const accessControlSchema = new mongoose.Schema<AccessControl>(
	{
		isFree: { type: Boolean, default: false },
		requiresPurchase: { type: Boolean, default: true },
		requiredSubscription: {
			type: String,
			enum: ["premium", "pro", null],
			default: null,
		},
		allowedRoles: [{ type: String }],
		allowedUserIds: [{ type: String, ref: "users" }],
	},
	{ _id: false },
);

const versionSchema = new mongoose.Schema<Version>(
	{
		appId: { type: String, required: true, index: true },
		versionNumber: { type: String, required: true, trim: true },
		versionCode: { type: Number, required: true, index: true },
		releaseName: { type: String, trim: true },
		changelog: { type: String, trim: true },
		files: { type: [versionFileSchema], required: true },
		accessControl: { type: accessControlSchema, default: () => ({}) },
		status: {
			type: String,
			enum: ["draft", "published", "deprecated", "archived"],
			default: "draft",
			index: true,
		},
		isLatest: { type: Boolean, default: false, index: true },
		publishedAt: { type: Date },
		downloadCount: { type: Number, default: 0 },
		isDeleted: { type: Boolean, default: false, index: true },
	},
	{ timestamps: true, collection: COLLECTION },
);

// Indexes
versionSchema.index({ appId: 1, versionCode: -1 });
versionSchema.index({ appId: 1, isLatest: 1, status: 1 });
versionSchema.index({ "files.platform": 1 });
versionSchema.index({ status: 1, publishedAt: -1 });

// Pre-save hook: auto unset isLatest when new version is marked as latest
versionSchema.pre("save", async function (next) {
	if (this.isNew || this.isModified("isLatest")) {
		if (this.isLatest) {
			await this.constructor.updateMany(
				{ appId: this.appId, _id: { $ne: this._id } },
				{ $set: { isLatest: false } },
			);
		}
	}
	next();
});

export const VersionModel =
	mongoose.models[COLLECTION] ||
	mongoose.model<Version>(COLLECTION, versionSchema);

interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export class VersionsRepository {
	async findAll(query: VersionQueryDTO): Promise<PaginatedResult<Version>> {
		const filter: Record<string, unknown> = { isDeleted: false };
		if (query.appId) filter.appId = query.appId;
		if (query.status) filter.status = query.status;
		if (query.isLatest !== undefined) filter.isLatest = query.isLatest;
		if (query.platform) filter["files.platform"] = query.platform;

		const page = query.page || 1;
		const limit = query.limit || 10;
		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			VersionModel.find(filter as Record<string, unknown>)
				.sort({ versionCode: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			VersionModel.countDocuments(filter),
		]);

		return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
	}

	async findById(id: string): Promise<Version | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return VersionModel.findOne({ _id: id, isDeleted: false }).lean();
	}

	async findByAppId(appId: string): Promise<Version[]> {
		return VersionModel.find({ appId, isDeleted: false })
			.sort({ versionCode: -1 })
			.lean();
	}

	async findLatestByAppId(appId: string): Promise<Version | null> {
		return VersionModel.findOne({
			appId,
			isLatest: true,
			isDeleted: false,
			status: "published",
		}).lean();
	}

	async findByPlatform(appId: string, platform: Platform): Promise<Version[]> {
		return VersionModel.find({
			appId,
			isDeleted: false,
			status: "published",
			"files.platform": platform,
		})
			.sort({ versionCode: -1 })
			.lean();
	}

	async create(data: CreateVersionDTO): Promise<Version> {
		const version = await VersionModel.create(data);
		return version.toObject();
	}

	async update(id: string, data: UpdateVersionDTO): Promise<Version | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return VersionModel.findOneAndUpdate({ _id: id, isDeleted: false }, data, {
			new: true,
		}).lean();
	}

	async delete(id: string): Promise<boolean> {
		if (!mongoose.Types.ObjectId.isValid(id)) return false;
		const result = await VersionModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ isDeleted: true },
		);
		return result !== null;
	}

	async incrementDownloadCount(id: string): Promise<Version | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return VersionModel.findByIdAndUpdate(
			id,
			{ $inc: { downloadCount: 1 } },
			{ new: true },
		).lean();
	}

	async publish(id: string): Promise<Version | null> {
		return this.update(id, { status: "published", publishedAt: new Date() });
	}

	async deprecate(id: string): Promise<Version | null> {
		return this.update(id, { status: "deprecated" });
	}

	async checkAccess(
		version: Version,
		userId?: string,
		userRole?: string,
	): Promise<boolean> {
		const { accessControl } = version;

		// Free app - everyone can access
		if (accessControl.isFree) return true;

		// Role whitelist check
		if (accessControl.allowedRoles.length > 0 && userRole) {
			if (accessControl.allowedRoles.includes(userRole)) return true;
		}

		// User whitelist check
		if (accessControl.allowedUserIds.length > 0 && userId) {
			if (accessControl.allowedUserIds.includes(userId)) return true;
		}

		// If requiresPurchase is false, access granted
		if (!accessControl.requiresPurchase) return true;

		// Otherwise, access depends on purchase/subscription (handled at service layer)
		return false;
	}
}
