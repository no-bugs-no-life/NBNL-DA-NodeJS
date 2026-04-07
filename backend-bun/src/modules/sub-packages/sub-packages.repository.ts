import mongoose from "mongoose";
import type { SubPackage, CreateSubPackageDTO, UpdateSubPackageDTO, SubPackageQueryRequest } from "./sub-packages.types";

const COLLECTION = "sub_packages";

const subPackageSchema = new mongoose.Schema<SubPackage>(
	{
		name: { type: String, required: true },
		appId: { type: String, default: null },
		type: { type: String, enum: ["monthly", "yearly", "lifetime"], required: true },
		price: { type: Number, required: true, min: 0 },
		durationDays: { type: Number, required: true, min: 1 },
		description: { type: String, default: "" },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true, collection: COLLECTION },
);

export const SubPackageModel =
	(mongoose.models[COLLECTION] as mongoose.Model<SubPackage> & { findActive: () => mongoose.Query<SubPackage[], SubPackage> }) ||
	mongoose.model<SubPackage>(COLLECTION, subPackageSchema);

export class SubPackagesRepository {
	async findAll(query: SubPackageQueryRequest): Promise<SubPackage[]> {
		const filter: Record<string, unknown> = { isDeleted: false };
		if (query.appId) filter.appId = query.appId;
		if (query.type) filter.type = query.type;
		if (query.isActive !== undefined) filter.isActive = query.isActive;

		return SubPackageModel.find(filter as Record<string, unknown>).sort({ price: 1 }).lean();
	}

	async findById(id: string): Promise<SubPackage | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return SubPackageModel.findOne({ _id: id, isDeleted: false }).lean();
	}

	async findByAppId(appId: string | null): Promise<SubPackage[]> {
		const filter = appId ? { appId, isDeleted: false } : { appId: null, isDeleted: false };
		return SubPackageModel.find(filter).sort({ price: 1 }).lean();
	}

	async create(data: CreateSubPackageDTO): Promise<SubPackage> {
		const subPackage = await SubPackageModel.create(data);
		return subPackage.toObject();
	}

	async update(id: string, data: UpdateSubPackageDTO): Promise<SubPackage | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return SubPackageModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			data,
			{ new: true },
		).lean();
	}

	async delete(id: string): Promise<boolean> {
		if (!mongoose.Types.ObjectId.isValid(id)) return false;
		const result = await SubPackageModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ isDeleted: true },
		);
		return result !== null;
	}

	async toggleActive(id: string): Promise<SubPackage | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		const subPackage = await SubPackageModel.findOne({ _id: id, isDeleted: false });
		if (!subPackage) return null;
		return SubPackageModel.findByIdAndUpdate(id, { isActive: !subPackage.isActive }, { new: true }).lean();
	}
}