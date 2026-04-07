import { AppError } from "@/shared/errors";
import type { PaginatedSubPackageResult } from "./sub-packages.repository";
import { SubPackagesRepository } from "./sub-packages.repository";
import type { SubPackageQueryRequest } from "./sub-packages.schema";
import type {
	CreateSubPackageDTO,
	SubPackage,
	UpdateSubPackageDTO,
} from "./sub-packages.types";

export class SubPackagesService {
	private repo: SubPackagesRepository;

	constructor(repo?: SubPackagesRepository) {
		this.repo = repo || new SubPackagesRepository();
	}

	async findAll(
		query: SubPackageQueryRequest,
	): Promise<PaginatedSubPackageResult> {
		return this.repo.findAll(query);
	}

	async findById(id: string): Promise<SubPackage> {
		const subPackage = await this.repo.findById(id);
		if (!subPackage) throw AppError.notFound("SubPackage not found");
		return subPackage;
	}

	async findByAppId(appId: string | null): Promise<SubPackage[]> {
		return this.repo.findByAppId(appId);
	}

	async create(data: CreateSubPackageDTO): Promise<SubPackage> {
		return this.repo.create(data);
	}

	async update(id: string, data: UpdateSubPackageDTO): Promise<SubPackage> {
		await this.findById(id);
		const updated = await this.repo.update(id, data);
		if (!updated) throw AppError.notFound("SubPackage not found");
		return updated;
	}

	async delete(id: string): Promise<void> {
		await this.findById(id);
		const deleted = await this.repo.delete(id);
		if (!deleted) throw AppError.internal("Failed to delete sub-package");
	}

	async toggleActive(id: string): Promise<SubPackage> {
		const toggled = await this.repo.toggleActive(id);
		if (!toggled) throw AppError.notFound("SubPackage not found");
		return toggled;
	}
}
