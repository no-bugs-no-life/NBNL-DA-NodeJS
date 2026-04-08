import type { IBaseRepository } from "./base.repository";

/**
 * Abstract Base Service
 * Coordinates business logic using a repository
 * Follows Separation of Concerns
 */
export abstract class BaseService<T> {
	constructor(protected readonly repository: IBaseRepository<T>) {}

	async findAll(): Promise<T[]> {
		return this.repository.findAll();
	}

	async findById(id: string): Promise<T | null> {
		const item = await this.repository.findById(id);
		if (!item) {
			// Logic for handling "not found" could be here or in specialized services
			return null;
		}
		return item;
	}

	async create(data: Partial<T>): Promise<T> {
		return this.repository.create(data);
	}

	async update(id: string, data: Partial<T>): Promise<T | null> {
		return this.repository.update(id, data);
	}

	async delete(id: string): Promise<boolean> {
		return this.repository.delete(id);
	}
}
