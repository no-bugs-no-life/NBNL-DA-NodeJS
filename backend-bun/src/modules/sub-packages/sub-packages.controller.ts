import type { Context } from "hono";
import {
	apiCreated,
	apiNoContent,
	apiSuccess,
} from "@/shared/utils/api-response.util";
import type {
	CreateSubPackageRequest,
	SubPackageQueryRequest,
	UpdateSubPackageRequest,
} from "./sub-packages.schema";
import { SubPackagesService } from "./sub-packages.service";

export class SubPackagesController {
	private service: SubPackagesService;

	constructor(service?: SubPackagesService) {
		this.service = service || new SubPackagesService();
	}

	async list(c: Context) {
		const query = c.req.valid("query") as SubPackageQueryRequest;
		const data = await this.service.findAll(query);
		return apiSuccess(c, data);
	}

	async getById(c: Context) {
		const id = c.req.param("id");
		const data = await this.service.findById(id);
		return apiSuccess(c, data);
	}

	async getByApp(c: Context) {
		const app = c.req.param("app");
		const data = await this.service.findByAppId(app === "global" ? null : app);
		return apiSuccess(c, data);
	}

	async getGlobal(c: Context) {
		const data = await this.service.findByAppId(null);
		return apiSuccess(c, data);
	}

	async create(c: Context) {
		const body = c.req.valid("json") as CreateSubPackageRequest;
		const data = await this.service.create(body);
		return apiCreated(c, data);
	}

	async update(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateSubPackageRequest;
		const data = await this.service.update(id, body);
		return apiSuccess(c, data);
	}

	async delete(c: Context) {
		const id = c.req.param("id");
		await this.service.delete(id);
		return apiNoContent(c);
	}

	async toggleActive(c: Context) {
		const id = c.req.param("id");
		const data = await this.service.toggleActive(id);
		return apiSuccess(c, data);
	}
}
