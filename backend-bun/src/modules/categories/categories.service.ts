import type { ICategoryRepository } from "./categories.repository";
import type { ICategory, CategoryPublic } from "./categories.types";
import { toPublicCategory } from "./categories.types";
import { notFound, conflict } from "@/shared/errors";
import type {
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from "./categories.schema";

export class CategoriesService {
	constructor(private readonly repository: ICategoryRepository) {}

	async getAllCategories(): Promise<CategoryPublic[]> {
		const categories = await this.repository.findAll();
		return categories.map(toPublicCategory);
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

	async createCategory(
		data: CreateCategoryRequest,
	): Promise<CategoryPublic> {
		const existing = await this.repository.findBySlug(data.slug);
		if (existing) throw conflict("Slug đã tồn tại");

		const category = await this.repository.create(data);
		return toPublicCategory(category);
	}

	async updateCategory(
		id: string,
		data: UpdateCategoryRequest,
	): Promise<CategoryPublic> {
		const existing = await this.repository.findById(id);
		if (!existing) throw notFound("Không tìm thấy danh mục");

		if (data.slug && data.slug !== existing.slug) {
			const slugExists = await this.repository.findBySlug(data.slug);
			if (slugExists) throw conflict("Slug đã tồn tại");
		}

		const updated = await this.repository.update(id, data as Partial<ICategory>);
		if (!updated) throw notFound("Không tìm thấy danh mục");
		return toPublicCategory(updated);
	}

	async deleteCategory(id: string): Promise<void> {
		const deleted = await this.repository.delete(id);
		if (!deleted) throw notFound("Không tìm thấy danh mục");
	}
}
