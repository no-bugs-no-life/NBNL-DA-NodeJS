import type { IBaseRepository } from "@/shared/base";
import type { IUser, UserQuery } from "./users.types";

export interface IUserRepository extends IBaseRepository<IUser> {
	findByEmail(email: string): Promise<IUser | null>;
	findByUsername(username: string): Promise<IUser | null>;
	findPublicById(id: string): Promise<IUser | null>;
	findAllPaginated(
		query: UserQuery,
	): Promise<{ users: IUser[]; total: number }>;
	updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;
}

export class UsersRepository implements IUserRepository {
	async findAll(): Promise<IUser[]> {
		// TODO: Implement with MongoDB
		return [];
	}

	async findById(_id: string): Promise<IUser | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async findByEmail(_email: string): Promise<IUser | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async findByUsername(_username: string): Promise<IUser | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async findPublicById(_id: string): Promise<IUser | null> {
		// TODO: Implement with MongoDB - select only public fields
		return null;
	}

	async findAllPaginated(
		_query: UserQuery,
	): Promise<{ users: IUser[]; total: number }> {
		// TODO: Implement with MongoDB
		return { users: [], total: 0 };
	}

	async create(_data: Partial<IUser>): Promise<IUser> {
		// TODO: Implement with MongoDB
		return {} as IUser;
	}

	async update(_id: string, _data: Partial<IUser>): Promise<IUser | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async updateProfile(
		_id: string,
		_data: Partial<IUser>,
	): Promise<IUser | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async delete(_id: string): Promise<boolean> {
		// TODO: Implement with MongoDB - soft delete
		return false;
	}
}
