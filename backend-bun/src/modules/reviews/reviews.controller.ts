import type { Context } from "hono";
import { ReviewsService } from "./reviews.service";
import { apiSuccess, apiCreated, apiNoContent } from "@/shared/utils/api-response.util";
import type { CreateReviewRequest, UpdateReviewRequest, ReviewQueryRequest } from "./reviews.schema";

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
}