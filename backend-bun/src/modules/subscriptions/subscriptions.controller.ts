import type { Context } from "hono";
import { SubscriptionsService } from "./subscriptions.service";
import { apiSuccess, apiCreated, apiNoContent } from "@/shared/utils/api-response.util";
import type {
	CreateSubscriptionRequest,
	UpdateSubscriptionRequest,
	SubscriptionQueryRequest,
} from "./subscriptions.schema";

export class SubscriptionsController {
	private service: SubscriptionsService;

	constructor(service?: SubscriptionsService) {
		this.service = service || new SubscriptionsService();
	}

	list(c: Context) {
		const query = c.req.valid("query") as SubscriptionQueryRequest;
		return apiSuccess(c, this.service.findAll(query));
	}

	getById(c: Context) {
		const id = c.req.param("id");
		return apiSuccess(c, this.service.findById(id));
	}

	getByUser(c: Context) {
		const userId = c.req.param("userId");
		return apiSuccess(c, this.service.findByUserId(userId));
	}

	getActiveByUser(c: Context) {
		const userId = c.req.param("userId");
		return apiSuccess(c, this.service.findActiveByUserId(userId));
	}

	create(c: Context) {
		const body = c.req.valid("json") as CreateSubscriptionRequest;
		return apiCreated(c, this.service.create(body));
	}

	update(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateSubscriptionRequest;
		return apiSuccess(c, this.service.update(id, body));
	}

	cancel(c: Context) {
		const id = c.req.param("id");
		return apiSuccess(c, this.service.cancel(id));
	}

	delete(c: Context) {
		const id = c.req.param("id");
		this.service.delete(id);
		return apiNoContent(c);
	}

	checkActive(c: Context) {
		const userId = c.req.param("userId");
		return apiSuccess(c, { hasActive: this.service.hasActiveSubscription(userId) });
	}
}