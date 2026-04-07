import { SubPackagesRepository } from "@/modules/sub-packages/sub-packages.repository";
import { badRequest, internal, notFound } from "@/shared/errors";
import { SubscriptionsRepository } from "./subscriptions.repository";
import type {
	CreateSubscriptionDTO,
	RenewSubscriptionDTO,
	Subscription,
	SubscriptionQueryDTO,
	SubscriptionWithRelations,
	UpdateSubscriptionDTO,
} from "./subscriptions.types";

export class SubscriptionsService {
	private repo: SubscriptionsRepository;
	private packageRepo: SubPackagesRepository;

	constructor(
		repo?: SubscriptionsRepository,
		packageRepo?: SubPackagesRepository,
	) {
		this.repo = repo || new SubscriptionsRepository();
		this.packageRepo = packageRepo || new SubPackagesRepository();
	}

	async findAll(
		query: SubscriptionQueryDTO & { page?: number; limit?: number },
	) {
		return this.repo.findAll(query);
	}

	async findById(id: string): Promise<Subscription> {
		const subscription = await this.repo.findById(id);
		if (!subscription) throw notFound("Subscription not found");
		return subscription;
	}

	async findByIdWithRelations(
		id: string,
	): Promise<SubscriptionWithRelations | null> {
		return this.repo.findByIdWithRelations(id);
	}

	async findActiveByUserId(user: string): Promise<Subscription | null> {
		return this.repo.findActiveByUserId(user);
	}

	async findByUserId(user: string): Promise<Subscription[]> {
		return this.repo.findByUserId(user);
	}

	async create(data: CreateSubscriptionDTO): Promise<Subscription> {
		const pkg = await this.packageRepo.findById(data.subPackage);
		if (!pkg) throw notFound("Package not found");
		if (!pkg.isActive) throw badRequest("Package is not active");

		const startDate = new Date();
		const endDate =
			pkg.type === "lifetime"
				? new Date("2099-12-31")
				: new Date(
						startDate.getTime() + pkg.durationDays * 24 * 60 * 60 * 1000,
					);

		return this.repo.create({ ...data, startDate, endDate });
	}

	async update(id: string, data: UpdateSubscriptionDTO): Promise<Subscription> {
		await this.findById(id);
		const updated = await this.repo.update(id, data);
		if (!updated) throw notFound("Subscription not found");
		return updated;
	}

	async cancel(id: string): Promise<Subscription> {
		return this.update(id, { status: "cancelled" });
	}

	async renew(
		id: string,
		dto: RenewSubscriptionDTO,
	): Promise<SubscriptionWithRelations> {
		const subscription = await this.findById(id);
		if (subscription.status !== "active") {
			throw badRequest("Can only renew active subscriptions");
		}

		const pkg = await this.packageRepo.findById(dto.packageId);
		if (!pkg) throw notFound("Package not found");
		if (!pkg.isActive) throw badRequest("Package is not active");

		const baseDate =
			new Date(subscription.endDate) > new Date()
				? new Date(subscription.endDate)
				: new Date();

		const newEndDate =
			pkg.type === "lifetime"
				? new Date("2099-12-31")
				: new Date(baseDate.getTime() + pkg.durationDays * 24 * 60 * 60 * 1000);

		await this.repo.update(id, {
			subPackage: dto.packageId,
			endDate: newEndDate,
		});
		return this.repo.findByIdWithRelations(
			id,
		) as Promise<SubscriptionWithRelations>;
	}

	async delete(id: string): Promise<void> {
		await this.findById(id);
		const deleted = await this.repo.delete(id);
		if (!deleted) throw internal("Failed to delete subscription");
	}

	async hasActiveSubscription(
		user: string,
		subPackage?: string,
	): Promise<boolean> {
		return this.repo.hasActiveSubscription(user, subPackage);
	}
}
