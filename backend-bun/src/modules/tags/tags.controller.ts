import type { Context } from "hono";
import {
	apiCreated,
	apiNoContent,
	apiSuccess,
} from "@/shared/utils/api-response.util";
import type {
	CreateTagRequest,
	TagQueryRequest,
	UpdateTagRequest,
} from "./tags.schema";
import { TagsService } from "./tags.service";

export class TagsController {
	private service: TagsService;

	constructor(service?: TagsService) {
		this.service = service || new TagsService();
	}

	list(c: Context) {
		const query = c.req.valid("query") as TagQueryRequest;
		return apiSuccess(c, this.service.findAll(query));
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
