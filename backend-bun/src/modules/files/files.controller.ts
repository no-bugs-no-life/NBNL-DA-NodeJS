import type { Context } from "hono";
import { FilesService } from "./files.service";
import { apiSuccess, apiCreated, apiNoContent } from "@/shared/utils/api-response.util";
import type { CreateFileRequest, FileQueryRequest } from "./files.schema";

export class FilesController {
	private service: FilesService;

	constructor(service?: FilesService) {
		this.service = service || new FilesService();
	}

	list(c: Context) {
		const query = c.req.valid("query") as FileQueryRequest;
		return apiSuccess(c, this.service.findAll(query));
	}

	getById(c: Context) {
		const id = c.req.param("id");
		return apiSuccess(c, this.service.findById(id));
	}

	create(c: Context) {
		const body = c.req.valid("json") as CreateFileRequest;
		return apiCreated(c, this.service.create(body));
	}

	delete(c: Context) {
		const id = c.req.param("id");
		this.service.delete(id);
		return apiNoContent(c);
	}

	deleteByUploader(c: Context) {
		const uploaderId = c.req.param("uploaderId");
		const count = this.service.deleteByUploader(uploaderId);
		return apiSuccess(c, { deletedCount: count });
	}
}