import type { Context } from "hono";
import {
	apiCreated,
	apiNoContent,
	apiSuccess,
} from "@/shared/utils/api-response.util";
import type {
	CreateSubscriptionRequest,
	RenewSubscriptionRequest,
	SubscriptionQueryRequest,
	UpdateSubscriptionRequest,
} from "./subscriptions.schema";
import { SubscriptionsService } from "./subscriptions.service";

export class SubscriptionsController {
	private service: SubscriptionsService;

	constructor(service?: SubscriptionsService) {
		this.service = service || new SubscriptionsService();
	}

	async list(c: Context) {
		// @ts-expect-error
		const query = c.req.valid("query") as SubscriptionQueryRequest;
		const { page, limit, userId, appId, subPackageId, status } = query;
		return apiSuccess(
			c,
			await this.service.findAll({
				userId,
				appId,
				subPackageId,
				status,
				page,
				limit,
			}),
		);
	}

	async getById(c: Context) {
		// biome-ignore lint/style/noNonNullAssertion: Guaranteed by Hono parameter
		const id = c.req.param("id")!;
		return apiSuccess(c, await this.service.findByIdWithRelations(id));
	}

	async getByUser(c: Context) {
		// biome-ignore lint/style/noNonNullAssertion: Guaranteed by Hono parameter
		const userId = c.req.param("userId")!;
		return apiSuccess(c, await this.service.findByUserId(userId));
	}

	async getActiveByUser(c: Context) {
		// biome-ignore lint/style/noNonNullAssertion: Guaranteed by Hono parameter
		const userId = c.req.param("userId")!;
		return apiSuccess(c, await this.service.findActiveByUserId(userId));
	}

	async create(c: Context) {
		// @ts-expect-error
		const body = c.req.valid("json") as CreateSubscriptionRequest;
		return apiCreated(
			c,
			await this.service.create({
				userId: body.userId,
				appId: body.appId || "",
				subPackageId: body.subPackageId,
				startDate: new Date(),
				endDate: new Date(),
			}),
		);
	}

	async update(c: Context) {
		// biome-ignore lint/style/noNonNullAssertion: Guaranteed by Hono parameter
		const id = c.req.param("id")!;
		// @ts-expect-error
		const body = c.req.valid("json") as UpdateSubscriptionRequest;
		return apiSuccess(
			c,
			await this.service.update(id, {
				status: body.status,
				endDate: body.endDate ? new Date(body.endDate) : undefined,
				subPackageId: body.subPackageId,
			}),
		);
	}

	async cancel(c: Context) {
		// biome-ignore lint/style/noNonNullAssertion: Guaranteed by Hono parameter
		const id = c.req.param("id")!;
		return apiSuccess(c, await this.service.cancel(id));
	}

	async renew(c: Context) {
		// biome-ignore lint/style/noNonNullAssertion: Guaranteed by Hono parameter
		const id = c.req.param("id")!;
		// @ts-expect-error
		const body = c.req.valid("json") as RenewSubscriptionRequest;
		return apiSuccess(c, await this.service.renew(id, body));
	}

	async delete(c: Context) {
		// biome-ignore lint/style/noNonNullAssertion: Guaranteed by Hono parameter
		const id = c.req.param("id")!;
		await this.service.delete(id);
		return apiNoContent(c);
	}

	async checkActive(c: Context) {
		// biome-ignore lint/style/noNonNullAssertion: Guaranteed by Hono parameter
		const userId = c.req.param("userId")!;
		return apiSuccess(c, {
			hasActive: await this.service.hasActiveSubscription(userId),
		});
	}
}
