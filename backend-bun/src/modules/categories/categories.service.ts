import { notFound } from "@/shared/errors";
import type { ICategoryRepository } from "./categories.repository";
import type {
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from "./categories.schema";
import type {
	CategoryPublic,
	ICategory,
	PaginatedCategories,
} from "./categories.types";
import { toPublicCategory } from "./categories.types";

type CreateData = Pick<ICategory, "name" | "iconUrl" | "parentId">;
type UpdateData = Partial<Pick<ICategory, "name" | "iconUrl" | "parentId">>;

export class CategoriesService {
	constructor(private readonly repository: ICategoryRepository) {}

	async getCategories(
		page: number,
		limit: number,
	): Promise<PaginatedCategories> {
		const { docs, totalDocs } = await this.repository.findAll({ page, limit });
		return {
			docs: docs.map(toPublicCategory),
			totalDocs,
			limit,
			totalPages: Math.ceil(totalDocs / limit),
			page,
		};
	}

	async getCategoryById(id: string): Promise<CategoryPublic> {
		const category = await this.repository.findById(id);
		if (!category) throw notFound("Không tìm thấy danh mục");
		return toPublicCategory(category);
	}

	async getCategoryBySlug(slug: string): Promise<CategoryPublic> {
		const category = await this.repository.findBySlug(slug);
		if (!category) throw notFound("Không tìm thấy danh mục");
		return toPublicCategory(category);
	}

	async createCategory(data: CreateCategoryRequest): Promise<CategoryPublic> {
		const createData: CreateData = {
			name: data.name,
			iconUrl: data.iconUrl ?? "",
			parentId: data.parentId ?? null,
		};
		const category = await this.repository.create(createData);
		return toPublicCategory(category);
	}

	async updateCategory(
		id: string,
		data: UpdateCategoryRequest,
	): Promise<CategoryPublic> {
		const existing = await this.repository.findById(id);
		if (!existing) throw notFound("Không tìm thấy danh mục");

		const updateData: UpdateData = {};
		if (data.name !== undefined) updateData.name = data.name;
		if (data.iconUrl !== undefined) updateData.iconUrl = data.iconUrl || "";
		if (data.parentId !== undefined) updateData.parentId = data.parentId;

		const updated = await this.repository.update(id, updateData);
		if (!updated) throw notFound("Không tìm thấy danh mục");
		return toPublicCategory(updated);
	}

	async deleteCategory(id: string): Promise<void> {
		const deleted = await this.repository.delete(id);
		if (!deleted) throw notFound("Không tìm thấy danh mục");
	}
}
