import type { Context } from "hono";
import { BaseController } from "@/shared/base";
import { CategoryRepository } from "./categories.repository";
import type {
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from "./categories.schema";
import { CategoriesService } from "./categories.service";

export class CategoriesController extends BaseController {
	private readonly categoriesService = new CategoriesService(
		new CategoryRepository(),
	);

	// GET /categories?page=1&limit=20
	async getAll(c: Context) {
		const page = parseInt(c.req.query("page") ?? "1", 10);
		const limit = parseInt(c.req.query("limit") ?? "20", 10);
		const data = await this.categoriesService.getCategories(page, limit);
		return c.json(this.ok(data, "Lấy danh sách danh mục thành công"));
	}

	// GET /categories/:id
	async getById(c: Context) {
		const id = c.req.param("id");
		if (!id) return c.json(this.fail("Thiếu tham số id"), 400);
		const category = await this.categoriesService.getCategoryById(id);
		return c.json(this.ok(category, "Lấy thông tin danh mục thành công"));
	}

	// GET /categories/slug/:slug
	async getBySlug(c: Context) {
		const slug = c.req.param("slug");
		if (!slug) return c.json(this.fail("Thiếu tham số slug"), 400);
		const category = await this.categoriesService.getCategoryBySlug(slug);
		return c.json(this.ok(category, "Lấy thông tin danh mục thành công"));
	}

	// POST /categories
	async create(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json") as CreateCategoryRequest;
		const category = await this.categoriesService.createCategory(data);
		return c.json(this.ok(category, "Tạo danh mục thành công"), 201);
	}

	// PUT /categories/:id
	async update(c: Context) {
		const id = c.req.param("id");
		if (!id) return c.json(this.fail("Thiếu tham số id"), 400);
		// @ts-expect-error
		const data = c.req.valid("json") as UpdateCategoryRequest;
		const category = await this.categoriesService.updateCategory(id, data);
		return c.json(this.ok(category, "Cập nhật danh mục thành công"));
	}

	// DELETE /categories/:id
	async delete(c: Context) {
		const id = c.req.param("id");
		if (!id) return c.json(this.fail("Thiếu tham số id"), 400);
		await this.categoriesService.deleteCategory(id);
		return c.json(this.ok(null, "Xóa danh mục thành công"));
	}
}
