import { BaseController } from "@/shared/base";
import { CategoriesService } from "./categories.service";
import { CategoryRepository } from "./categories.repository";
import type { Context } from "hono";
import type {
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from "./categories.schema";

export class CategoriesController extends BaseController {
	private readonly categoriesService = new CategoriesService(
		new CategoryRepository(),
	);

	async getAll(c: Context) {
		const categories = await this.categoriesService.getAllCategories();
		return c.json(this.ok(categories, "Lấy danh sách danh mục thành công"));
	}

	async getById(c: Context) {
		const id = c.req.param("id");
		if (!id) return c.json(this.fail("Thiếu tham số id"), 400);
		const category = await this.categoriesService.getCategoryById(id);
		return c.json(this.ok(category, "Lấy thông tin danh mục thành công"));
	}

	async getBySlug(c: Context) {
		const slug = c.req.param("slug");
		if (!slug) return c.json(this.fail("Thiếu tham số slug"), 400);
		const category = await this.categoriesService.getCategoryBySlug(slug);
		return c.json(this.ok(category, "Lấy thông tin danh mục thành công"));
	}

	async create(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json") as CreateCategoryRequest;
		const category = await this.categoriesService.createCategory(data);
		return c.json(this.ok(category, "Tạo danh mục thành công"), 201);
	}

	async update(c: Context) {
		const id = c.req.param("id");
		if (!id) return c.json(this.fail("Thiếu tham số id"), 400);
		// @ts-expect-error
		const data = c.req.valid("json") as UpdateCategoryRequest;
		const category = await this.categoriesService.updateCategory(id, data);
		return c.json(this.ok(category, "Cập nhật danh mục thành công"));
	}

	async delete(c: Context) {
		const id = c.req.param("id");
		if (!id) return c.json(this.fail("Thiếu tham số id"), 400);
		await this.categoriesService.deleteCategory(id);
		return c.json(this.ok(null, "Xóa danh mục thành công"));
	}
}
