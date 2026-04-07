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

	list(c: Context) {
		const query = c.req.valid("query") as SubPackageQueryRequest;
		return apiSuccess(c, this.service.findAll(query));
	}

	getById(c: Context) {
		const id = c.req.param("id");
		return apiSuccess(c, this.service.findById(id));
	}

	getByApp(c: Context) {
		const app = c.req.param("app");
		return apiSuccess(
			c,
			this.service.findByAppId(app === "global" ? null : app),
		);
	}

	getGlobal(c: Context) {
		return apiSuccess(c, this.service.findByAppId(null));
	}

	create(c: Context) {
		const body = c.req.valid("json") as CreateSubPackageRequest;
		return apiCreated(c, this.service.create(body));
	}

	update(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateSubPackageRequest;
		return apiSuccess(c, this.service.update(id, body));
	}

	delete(c: Context) {
		const id = c.req.param("id");
		this.service.delete(id);
		return apiNoContent(c);
	}

	toggleActive(c: Context) {
		const id = c.req.param("id");
		return apiSuccess(c, this.service.toggleActive(id));
	}
}
