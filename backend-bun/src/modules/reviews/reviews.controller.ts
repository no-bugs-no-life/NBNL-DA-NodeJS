import type { Context } from "hono";
import {
	apiCreated,
	apiNoContent,
	apiSuccess,
} from "@/shared/utils/api-response.util";
import type {
	CreateReviewRequest,
	ReviewQueryRequest,
	UpdateReviewRequest,
} from "./reviews.schema";
import { ReviewsService } from "./reviews.service";

export class ReviewsController {
	private service: ReviewsService;

	constructor(service?: ReviewsService) {
		this.service = service || new ReviewsService();
	}

	list(c: Context) {
		const query = c.req.valid("query") as ReviewQueryRequest;
		return apiSuccess(c, this.service.findAll(query));
	}

	getById(c: Context) {
		const id = c.req.param("id");
		return apiSuccess(c, this.service.findById(id));
	}

	getByApp(c: Context) {
		const appId = c.req.param("appId");
		return apiSuccess(c, this.service.findByAppId(appId));
	}

	create(c: Context) {
		const body = c.req.valid("json") as CreateReviewRequest;
		return apiCreated(c, this.service.create(body));
	}

	update(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateReviewRequest;
		return apiSuccess(c, this.service.update(id, body));
	}

	delete(c: Context) {
		const id = c.req.param("id");
		this.service.delete(id);
		return apiNoContent(c);
	}

	// Admin endpoints
	async listAdmin(c: Context) {
		const query = c.req.valid("query") as ReviewQueryRequest;
		const result = await this.service.findAllAdmin(query);
		return apiSuccess(c, result);
	}

	async createAdmin(c: Context) {
		const body = c.req.valid("json") as CreateReviewRequest;
		const review = await this.service.createAdmin(body);
		const populated = await this.service.findByIdAdmin(review._id.toString());
		return apiCreated(c, populated);
	}

	async updateAdmin(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateReviewRequest;
		await this.service.update(id, body);
		const review = await this.service.findByIdAdmin(id);
		return apiSuccess(c, review);
	}

	async approve(c: Context) {
		const id = c.req.param("id");
		await this.service.approve(id);
		const review = await this.service.findByIdAdmin(id);
		return apiSuccess(c, review);
	}

	async reject(c: Context) {
		const id = c.req.param("id");
		await this.service.reject(id);
		const review = await this.service.findByIdAdmin(id);
		return apiSuccess(c, review);
	}

	async reset(c: Context) {
		const id = c.req.param("id");
		await this.service.reset(id);
		const review = await this.service.findByIdAdmin(id);
		return apiSuccess(c, review);
	}

	async deleteAdmin(c: Context) {
		const id = c.req.param("id");
		await this.service.delete(id);
		return apiNoContent(c);
	}
}
