import { badRequest, notFound, conflict, internal } from "@/shared/errors";
import type { App, CreateAppDTO, UpdateAppDTO, AppFilters } from "./apps.types";
import { AppsRepository } from "./apps.repository";

export class AppsService {
	private repo: AppsRepository;

	constructor(repo?: AppsRepository) {
		this.repo = repo || new AppsRepository();
	}

	private slugify(text: string): string {
		return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
	}

	async findAll(
		filters: AppFilters = {},
		page = 1,
		limit = 20,
	): Promise<{ apps: App[]; total: number; page: number; limit: number }> {
		const result = await this.repo.findAll(filters, page, limit);
		return { ...result, page, limit };
	}

	async findById(id: string): Promise<App> {
		if (!id) throw badRequest("Invalid app ID");
		const app = await this.repo.findById(id);
		if (!app) throw notFound("App not found");
		return app;
	}

	async findBySlug(slug: string): Promise<App> {
		if (!slug) throw badRequest("Invalid slug");
		const app = await this.repo.findBySlug(slug);
		if (!app) throw notFound("App not found");
		return app;
	}

	async findByDeveloper(developerId: string): Promise<App[]> {
		if (!developerId) throw badRequest("Invalid developer ID");
		return this.repo.findByDeveloper(developerId);
	}

	async create(data: CreateAppDTO): Promise<App> {
		const slug = data.slug || this.slugify(data.name);

		if (await this.repo.existsBySlug(slug)) {
			throw conflict("App with this slug already exists");
		}

		return this.repo.create({ ...data, slug });
	}

	async update(id: string, data: UpdateAppDTO): Promise<App> {
		await this.findById(id);

		if (data.slug) {
			const slug = data.slug;
			if (await this.repo.existsBySlug(slug, id)) {
				throw conflict("App with this slug already exists");
			}
		}

		const updated = await this.repo.update(id, data);
		if (!updated) throw notFound("App not found");
		return updated;
	}

	async delete(id: string, hard = false): Promise<void> {
		await this.findById(id);

		const deleted = hard
			? await this.repo.hardDelete(id)
			: await this.repo.softDelete(id);

		if (!deleted) throw internal("Failed to delete app");
	}

	async updateStatus(id: string, status: App["status"]): Promise<App> {
		return this.update(id, { status });
	}

	async toggleDisable(id: string): Promise<App> {
		const app = await this.findById(id);
		return this.update(id, { isDisabled: !app.isDisabled });
	}

	async updateRating(appId: string, ratingScore: number, ratingCount: number): Promise<void> {
		await this.repo.updateRating(appId, ratingScore, ratingCount);
	}
}