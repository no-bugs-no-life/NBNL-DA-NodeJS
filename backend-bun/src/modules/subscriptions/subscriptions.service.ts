import { AppError } from "@/shared/errors";
import type {
	Subscription,
	CreateSubscriptionDTO,
	UpdateSubscriptionDTO,
	SubscriptionQueryDTO,
} from "./subscriptions.types";
import { SubscriptionsRepository } from "./subscriptions.repository";

export class SubscriptionsService {
	private repo: SubscriptionsRepository;

	constructor(repo?: SubscriptionsRepository) {
		this.repo = repo || new SubscriptionsRepository();
	}

	async findAll(query: SubscriptionQueryDTO & { page?: number; limit?: number }) {
		return this.repo.findAll(query);
	}

	async findById(id: string): Promise<Subscription> {
		const subscription = await this.repo.findById(id);
		if (!subscription) throw AppError.notFound("Subscription not found");
		return subscription;
	}

	async findActiveByUserId(userId: string): Promise<Subscription | null> {
		return this.repo.findActiveByUserId(userId);
	}

	async findByUserId(userId: string): Promise<Subscription[]> {
		return this.repo.findByUserId(userId);
	}

	async create(data: CreateSubscriptionDTO): Promise<Subscription> {
		if (await this.repo.hasActiveSubscription(data.userId)) {
			throw AppError.conflict("User already has an active subscription");
		}
		return this.repo.create(data);
	}

	async update(id: string, data: UpdateSubscriptionDTO): Promise<Subscription> {
		await this.findById(id);
		const updated = await this.repo.update(id, data);
		if (!updated) throw AppError.notFound("Subscription not found");
		return updated;
	}

	async cancel(id: string): Promise<Subscription> {
		return this.update(id, { status: "cancelled" });
	}

	async delete(id: string): Promise<void> {
		await this.findById(id);
		const deleted = await this.repo.delete(id);
		if (!deleted) throw AppError.internal("Failed to delete subscription");
	}

	async hasActiveSubscription(userId: string, subPackageId?: string): Promise<boolean> {
		return this.repo.hasActiveSubscription(userId, subPackageId);
	}
}