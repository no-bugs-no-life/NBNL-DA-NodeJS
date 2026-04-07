import { env } from "@/config/env";
import type { IUser, UserQuery } from "./users.types";
import type { IBaseRepository } from "@/shared/base";

export interface IUserRepository extends IBaseRepository<IUser> {
	findByEmail(email: string): Promise<IUser | null>;
	findByUsername(username: string): Promise<IUser | null>;
	findPublicById(id: string): Promise<IUser | null>;
	findAllPaginated(query: UserQuery): Promise<{ users: IUser[]; total: number }>;
	updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;
}

export class UsersRepository implements IUserRepository {
	private readonly collection = env.MONGO_COLLECTION_USERS || "users";

	async findAll(): Promise<IUser[]> {
		// TODO: Implement with MongoDB
		return [];
	}

	async findById(id: string): Promise<IUser | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async findByEmail(email: string): Promise<IUser | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async findByUsername(username: string): Promise<IUser | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async findPublicById(id: string): Promise<IUser | null> {
		// TODO: Implement with MongoDB - select only public fields
		return null;
	}

	async findAllPaginated(query: UserQuery): Promise<{ users: IUser[]; total: number }> {
		// TODO: Implement with MongoDB
		return { users: [], total: 0 };
	}

	async create(data: Partial<IUser>): Promise<IUser> {
		// TODO: Implement with MongoDB
		return {} as IUser;
	}

	async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async delete(id: string): Promise<boolean> {
		// TODO: Implement with MongoDB - soft delete
		return false;
	}
}
