import type { Context } from "hono";
import { TagsService } from "./tags.service";
import { apiSuccess, apiCreated, apiNoContent } from "@/shared/utils/api-response.util";
import type { CreateTagRequest, UpdateTagRequest } from "./tags.schema";

export class TagsController {
	private service: TagsService;

	constructor(service?: TagsService) {
		this.service = service || new TagsService();
	}

	list(c: Context) {
		const tags = this.service.findAll();
		return apiSuccess(c, tags);
	}

	getById(c: Context) {
		const id = c.req.param("id");
		const tag = this.service.findById(id);
		return apiSuccess(c, tag);
	}

	create(c: Context) {
		const body = c.req.valid("json") as CreateTagRequest;
		const tag = this.service.create(body);
		return apiCreated(c, tag);
	}

	update(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateTagRequest;
		const tag = this.service.update(id, body);
		return apiSuccess(c, tag);
	}

	delete(c: Context) {
		const id = c.req.param("id");
		this.service.delete(id);
		return apiNoContent(c);
	}
}
