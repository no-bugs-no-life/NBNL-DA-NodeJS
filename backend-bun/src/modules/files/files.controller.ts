import type { Context } from "hono";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { BaseController } from "@/shared/base";
import { FileRepository } from "./files.repository";
import { FilesService } from "./files.service";

export class FilesController extends BaseController {
	private readonly filesService = new FilesService(new FileRepository());
	private readonly uploadRoot = path.join(process.cwd(), "uploads");

	private toAbsoluteUrl(c: Context, relativePath: string): string {
		return new URL(relativePath, c.req.url).toString();
	}

	private normalizeOwnerType(ownerType: string | undefined) {
		const value = (ownerType || "app").toLowerCase();
		if (value === "user") return "user";
		if (value === "developer") return "developer";
		return "app";
	}

	private normalizeFileType(fileType: string | undefined) {
		const value = (fileType || "other").toLowerCase();
		if (value === "icon" || value === "avatar" || value === "banner") return value;
		return "other";
	}

	private buildStoredFilename(originalName: string) {
		const ext = path.extname(originalName || "").toLowerCase() || ".bin";
		return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
	}

	private async saveUpload(c: Context) {
		const formData = await c.req.formData();
		const uploadedFile = formData.get("file");
		if (!(uploadedFile instanceof File)) {
			return c.json(this.fail("Thiếu file upload"), 400);
		}

		const ownerType = this.normalizeOwnerType(String(formData.get("ownerType") || ""));
		const ownerId = String(formData.get("ownerId") || "unknown");
		const fileType = this.normalizeFileType(String(formData.get("fileType") || ""));
		const filename = this.buildStoredFilename(uploadedFile.name);
		const targetDir = path.join(this.uploadRoot, ownerType, ownerId);
		const fullPath = path.join(targetDir, filename);

		await mkdir(targetDir, { recursive: true });
		await Bun.write(fullPath, uploadedFile);

		const url = `/uploads/${ownerType}/${ownerId}/${filename}`;
		const saved = await this.filesService.createFile({
			ownerType,
			ownerId,
			fileType,
			url,
		});

		return c.json({ ...saved, url: this.toAbsoluteUrl(c, url) });
	}

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

	// POST /files/upload-image
	async uploadImage(c: Context) {
		return this.saveUpload(c);
	}

	// POST /files/upload-app-file
	async uploadAppFile(c: Context) {
		return this.saveUpload(c);
	}
}
