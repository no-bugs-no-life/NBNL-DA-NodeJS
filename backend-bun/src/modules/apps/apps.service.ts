import { AppError } from "@/shared/errors";
import { AppsRepository } from "./apps.repository";
import type {
	App,
	AppFilters,
	AppWithRelations,
	CreateAppDTO,
	UpdateAppDTO,
} from "./apps.types";

export class AppsService {
	private repo: AppsRepository;

	constructor(repo?: AppsRepository) {
		this.repo = repo || new AppsRepository();
	}

	private slugify(text: string): string {
		return text
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
	}

	async findAll(
		filters: AppFilters,
		page = 1,
		limit = 20,
	): Promise<{
		apps: AppWithRelations[];
		total: number;
		page: number;
		limit: number;
	}> {
		return this.repo.findAll(filters, page, limit);
	}

	async findById(id: string): Promise<AppWithRelations> {
		if (!id) throw AppError.badRequest("Invalid app ID");
		const app = await this.repo.findById(id);
		if (!app) throw AppError.notFound("App not found");
		return app;
	}

	async findBySlug(slug: string): Promise<AppWithRelations> {
		if (!slug) throw AppError.badRequest("Invalid slug");
		const app = await this.repo.findBySlug(slug);
		if (!app) throw AppError.notFound("App not found");
		return app;
	}

	async findByDeveloper(developerId: string): Promise<AppWithRelations[]> {
		if (!developerId) throw AppError.badRequest("Invalid developer ID");
		return this.repo.findByDeveloper(developerId);
	}

	async create(data: CreateAppDTO): Promise<App> {
		const slug = data.slug || this.slugify(data.name);

		if (await this.repo.existsBySlug(slug)) {
			throw AppError.conflict("App with this slug already exists");
		}

		return this.repo.create({ ...data, slug });
	}

	async update(id: string, data: UpdateAppDTO): Promise<AppWithRelations> {
		await this.findById(id);

		if (data.slug) {
			const slug = data.slug;
			if (await this.repo.existsBySlug(slug, id)) {
				throw AppError.conflict("App with this slug already exists");
			}
		}

		const updated = await this.repo.update(id, data);
		if (!updated) throw AppError.notFound("App not found");

		// Return populated app
		return this.findById(id);
	}

	async delete(id: string, hard = false): Promise<void> {
		await this.findById(id);

		const deleted = hard
			? await this.repo.hardDelete(id)
			: await this.repo.softDelete(id);

		if (!deleted) throw AppError.internal("Failed to delete app");
	}

	async approve(id: string): Promise<AppWithRelations> {
		return this.update(id, { status: "published" });
	}

	async publish(id: string): Promise<AppWithRelations> {
		return this.update(id, { status: "published" });
	}

	async reject(id: string): Promise<AppWithRelations> {
		return this.update(id, { status: "rejected" });
	}

	async toggleDisable(id: string): Promise<AppWithRelations> {
		const app = await this.findById(id);
		return this.update(id, { isDisabled: !app.isDisabled });
	}

	async disable(id: string): Promise<AppWithRelations> {
		return this.update(id, { isDisabled: true });
	}

	async enable(id: string): Promise<AppWithRelations> {
		return this.update(id, { isDisabled: false });
	}

	async updateStatus(
		id: string,
		status: App["status"],
	): Promise<AppWithRelations> {
		return this.update(id, { status });
	}

	async updateRating(
		appId: string,
		ratingScore: number,
		ratingCount: number,
	): Promise<void> {
		await this.repo.updateRating(appId, ratingScore, ratingCount);
	}
}
