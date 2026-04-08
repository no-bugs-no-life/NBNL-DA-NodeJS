import type { Context } from "hono";
import { BaseController } from "@/shared/base";
import { FileRepository } from "./files.repository";
import { ChunkUploadService } from "./chunk-upload.service";
import { FilesService } from "./files.service";
import type { FileType, OwnerType } from "./files.types";

export class FilesController extends BaseController {
	private readonly filesService = new FilesService(new FileRepository());
	private readonly chunkUploadService = new ChunkUploadService(this.filesService);

	private normalizeOwnerType(ownerType: string | undefined): OwnerType {
		const value = (ownerType || "app").toLowerCase();
		if (value === "user") return "user";
		if (value === "developer") return "developer";
		return "app";
	}

	private normalizeFileType(fileType: string | undefined): FileType {
		const value = (fileType || "other").toLowerCase();
		if (value === "apk" || value === "ipa") return value;
		if (value === "icon" || value === "avatar" || value === "banner") return value;
		if (value === "screenshot" || value === "other") return value;
		return "other";
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
		return this.uploadInit(c);
	}

	// POST /files/upload-app-file
	async uploadAppFile(c: Context) {
		return this.uploadInit(c);
	}

	// POST /files/uploads/init
	async uploadInit(c: Context) {
		const body = await c.req.json();
		const ownerType = this.normalizeOwnerType(body?.ownerType);
		const ownerId = String(body?.ownerId || "unknown");
		const fileType = this.normalizeFileType(body?.fileType);
		const originalName = String(body?.fileName || "");
		const totalSize = Number(body?.totalSize || 0);
		if (!originalName || totalSize <= 0) {
			return c.json(this.fail("Thiếu metadata upload hợp lệ"), 400);
		}

		const session = await this.chunkUploadService.initUpload({
			ownerType,
			ownerId,
			fileType,
			originalName,
			totalSize,
			mimeType: String(body?.mimeType || "application/octet-stream"),
		});
		return c.json(this.ok(session, "Khởi tạo upload thành công"));
	}

	// POST /files/uploads/chunk
	async uploadChunk(c: Context) {
		const formData = await c.req.formData();
		const uploadId = String(formData.get("uploadId") || "");
		const chunkIndex = Number(formData.get("chunkIndex"));
		const chunkFile = formData.get("chunk");
		if (!uploadId || Number.isNaN(chunkIndex) || !(chunkFile instanceof File)) {
			return c.json(this.fail("Dữ liệu chunk không hợp lệ"), 400);
		}

		await this.chunkUploadService.saveChunk(uploadId, chunkIndex, chunkFile);
		return c.json(this.ok({ uploadId, chunkIndex }, "Tải chunk thành công"));
	}

	// POST /files/uploads/complete
	async completeUpload(c: Context) {
		const body = await c.req.json();
		const uploadId = String(body?.uploadId || "");
		if (!uploadId) return c.json(this.fail("Thiếu uploadId"), 400);

		try {
			const result = await this.chunkUploadService.completeUpload(uploadId, c.req.url);
			return c.json(
				this.ok(
					{
						...result.file,
						url: result.absoluteUrl,
						uploadId: result.uploadId,
						status: result.status,
					},
					"Upload thành công",
				),
			);
		} catch {
			return c.json(
				this.fail("Ghép file thất bại sau 3 lần thử. Upload đã chuyển fail."),
				500,
			);
		}
	}
}
