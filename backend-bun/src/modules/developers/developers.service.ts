import { badRequest, notFound } from "@/shared/errors";
import { DevelopersRepository } from "./developers.repository";
import type {
	CreateDeveloperDTO,
	DeveloperPermissions,
	DeveloperQuery,
	DeveloperResponse,
	UpdateDeveloperDTO,
} from "./developers.types";

export class DevelopersService {
	private repo: DevelopersRepository;

	constructor(repo?: DevelopersRepository) {
		this.repo = repo || new DevelopersRepository();
	}

	async findAll(
		query: DeveloperQuery,
	): Promise<{ developers: DeveloperResponse[]; total: number }> {
		return this.repo.findAll(query);
	}

	async findById(id: string): Promise<DeveloperResponse> {
		if (!id) throw badRequest("Invalid developer ID");
		const dev = await this.repo.findById(id);
		if (!dev) throw notFound("Developer not found");
		return dev;
	}

	async findByUserId(userId: string): Promise<DeveloperResponse | null> {
		return this.repo.findByUserId(userId);
	}

	async create(
		data: CreateDeveloperDTO,
		_requestingUserId: string,
	): Promise<DeveloperResponse> {
		// Check if user already has a developer profile
		const existing = await this.repo.findByUserId(data.userId);
		if (existing) {
			throw badRequest("User already has a developer profile");
		}

		const dev = await this.repo.create(data);
		const result = await this.repo.findById(dev._id?.toString());
		if (!result) throw notFound("Failed to create developer");
		return result;
	}

	async update(
		id: string,
		data: UpdateDeveloperDTO,
	): Promise<DeveloperResponse> {
		await this.findById(id);
		const updated = await this.repo.update(id, data);
		if (!updated) throw notFound("Developer not found");

		const result = await this.repo.findById(id);
		if (!result) throw notFound("Developer not found");
		return result;
	}

	async approve(
		id: string,
		approvedBy: string,
		permissions?: Partial<DeveloperPermissions>,
	): Promise<DeveloperResponse> {
		const dev = await this.repo.findById(id);
		if (!dev) throw notFound("Developer not found");

		if (dev.status === "approved") {
			throw badRequest("Developer is already approved");
		}

		const updated = await this.repo.approve(id, approvedBy, permissions);
		if (!updated) throw notFound("Failed to approve developer");

		const result = await this.repo.findById(id);
		if (!result) throw notFound("Developer not found");
		return result;
	}

	async reject(id: string, reason: string): Promise<DeveloperResponse> {
		const dev = await this.repo.findById(id);
		if (!dev) throw notFound("Developer not found");

		if (dev.status === "rejected") {
			throw badRequest("Developer is already rejected");
		}

		const updated = await this.repo.reject(id, reason);
		if (!updated) throw notFound("Failed to reject developer");

		const result = await this.repo.findById(id);
		if (!result) throw notFound("Developer not found");
		return result;
	}

	async revoke(id: string, reason?: string): Promise<DeveloperResponse> {
		const dev = await this.repo.findById(id);
		if (!dev) throw notFound("Developer not found");

		const updated = await this.repo.revoke(id, reason);
		if (!updated) throw notFound("Failed to revoke developer");

		const result = await this.repo.findById(id);
		if (!result) throw notFound("Developer not found");
		return result;
	}

	async updatePermissions(
		id: string,
		permissions: Partial<DeveloperPermissions>,
	): Promise<DeveloperResponse> {
		await this.findById(id);
		const updated = await this.repo.updatePermissions(id, permissions);
		if (!updated) throw notFound("Failed to update permissions");

		const result = await this.repo.findById(id);
		if (!result) throw notFound("Developer not found");
		return result;
	}

	async delete(id: string): Promise<void> {
		await this.findById(id);
		const deleted = await this.repo.softDelete(id);
		if (!deleted) throw notFound("Failed to delete developer");
	}
}
