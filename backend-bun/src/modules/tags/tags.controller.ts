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

	async list(c: Context) {
		const query = c.req.valid("query") as TagQueryRequest;
		return apiSuccess(c, await this.service.findAll(query));
	}

	async getById(c: Context) {
		const id = c.req.param("id") || "";
		const tag = await this.service.findById(id);
		return apiSuccess(c, tag);
	}

	async create(c: Context) {
		const body = c.req.valid("json") as CreateTagRequest;
		const tag = await this.service.create(body);
		return apiCreated(c, tag);
	}

	async update(c: Context) {
		const id = c.req.param("id") || "";
		const body = c.req.valid("json") as UpdateTagRequest;
		const tag = await this.service.update(id, body);
		return apiSuccess(c, tag);
	}

	async delete(c: Context) {
		const id = c.req.param("id") || "";
		await this.service.delete(id);
		return apiNoContent(c);
	}
}
