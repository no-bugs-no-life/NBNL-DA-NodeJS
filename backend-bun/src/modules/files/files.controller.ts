import type { Context } from "hono";
import { BaseController } from "@/shared/base";
import { FileRepository } from "./files.repository";
import { FilesService } from "./files.service";

export class FilesController extends BaseController {
	private readonly filesService = new FilesService(new FileRepository());

	// GET /files?page=1&limit=20&ownerType=app&fileType=icon
	async getAll(c: Context) {
		const query = c.req.query();
		const page = parseInt(query.page ?? "1", 10);
		const limit = parseInt(query.limit ?? "20", 10);
		const { ownerType, fileType, ownerId } = query;

		const data = await this.filesService.getFiles(page, limit, {
			// biome-ignore lint/suspicious/noExplicitAny: Required for query types
			ownerType: ownerType as any,
			ownerId,
			// biome-ignore lint/suspicious/noExplicitAny: Required for query types
			fileType: fileType as any,
		});
		return c.json(this.ok(data, "Lấy danh sách file thành công"));
	}

	// GET /files/:id
	async getById(c: Context) {
		const id = c.req.param("id");
		if (!id) return c.json(this.fail("Thiếu tham số id"), 400);

		const file = await this.filesService.getFileById(id);
		return c.json(this.ok(file, "Lấy thông tin file thành công"));
	}

	// POST /files/create
	async create(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json");
		const file = await this.filesService.createFile(data);
		return c.json(this.ok(file, "Tạo file thành công"), 201);
	}

	// PUT /files/:id
	async update(c: Context) {
		const id = c.req.param("id");
		if (!id) return c.json(this.fail("Thiếu tham số id"), 400);

		// @ts-expect-error
		const data = c.req.valid("json");
		const file = await this.filesService.updateFile(id, data);
		return c.json(this.ok(file, "Cập nhật file thành công"));
	}

	// DELETE /files/:id
	async delete(c: Context) {
		const id = c.req.param("id");
		if (!id) return c.json(this.fail("Thiếu tham số id"), 400);

		await this.filesService.deleteFile(id);
		return c.json(this.ok(null, "Xóa file thành công"));
	}

	// POST /files/upload-image (placeholder)
	async uploadImage(c: Context) {
		// TODO: Implement actual file upload
		return c.json(this.fail("Chưa implement upload image"), 501);
	}

	// POST /files/upload-app-file (placeholder)
	async uploadAppFile(c: Context) {
		// TODO: Implement actual file upload
		return c.json(this.fail("Chưa implement upload app file"), 501);
	}
}
