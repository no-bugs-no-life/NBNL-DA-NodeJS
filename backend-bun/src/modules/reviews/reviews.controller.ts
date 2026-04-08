import type { Context } from "hono";
import {
	apiCreated,
	apiNoContent,
	apiSuccess,
} from "@/shared/utils/api-response.util";
import type {
	AdminCreateReviewRequest,
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

	async list(c: Context) {
		const query = c.req.valid("query") as ReviewQueryRequest;
		const data = await this.service.findAll(query);
		return apiSuccess(c, data);
	}

	async getById(c: Context) {
		const id = c.req.param("id");
		const review = await this.service.findById(id);
		return apiSuccess(c, review);
	}

	async getByApp(c: Context) {
		const app = c.req.param("app");
		const data = await this.service.findByAppId(app);
		return apiSuccess(c, data);
	}

	async create(c: Context) {
		const body = c.req.valid("json") as CreateReviewRequest;
		const review = await this.service.create(body);
		return apiCreated(c, review);
	}

	async update(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateReviewRequest;
		const review = await this.service.update(id, body);
		return apiSuccess(c, review);
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
		const body = c.req.valid("json") as AdminCreateReviewRequest;
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
