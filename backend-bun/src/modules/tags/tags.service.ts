import { AppError } from "@/shared/errors";
import type { Tag, CreateTagDTO, UpdateTagDTO } from "./tags.types";
import { TagsRepository } from "./tags.repository";

export class TagsService {
	private repo: TagsRepository;

	constructor(repo?: TagsRepository) {
		this.repo = repo || new TagsRepository();
	}

	private slugify(text: string): string {
		return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
	}

	async findAll(): Promise<Tag[]> {
		return this.repo.findAll();
	}

	async findById(id: string): Promise<Tag> {
		const tag = await this.repo.findById(id);
		if (!tag) throw AppError.notFound("Tag not found");
		return tag;
	}

	async findBySlug(slug: string): Promise<Tag> {
		const tag = await this.repo.findBySlug(slug);
		if (!tag) throw AppError.notFound("Tag not found");
		return tag;
	}

	async create(data: CreateTagDTO): Promise<Tag> {
		const slug = data.slug || this.slugify(data.name);
		if (await this.repo.existsBySlug(slug)) {
			throw AppError.conflict("Tag with this slug already exists");
		}
		return this.repo.create({ ...data, slug });
	}

	async update(id: string, data: UpdateTagDTO): Promise<Tag> {
		await this.findById(id);
		if (data.slug && (await this.repo.existsBySlug(data.slug, id))) {
			throw AppError.conflict("Tag with this slug already exists");
		}
		const updated = await this.repo.update(id, data);
		if (!updated) throw AppError.notFound("Tag not found");
		return updated;
	}

	async delete(id: string): Promise<void> {
		await this.findById(id);
		const deleted = await this.repo.delete(id);
		if (!deleted) throw AppError.internal("Failed to delete tag");
	}
}
