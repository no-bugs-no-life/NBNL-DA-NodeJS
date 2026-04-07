import type { IBaseRepository } from "@/shared/base";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
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
	private get db() {
		// biome-ignore lint/style/noNonNullAssertion: Required after DB connected
		return mongoose.connection.db!;
	}

	private get collection() {
		return this.db.collection("users");
	}

	async findAll(): Promise<IUser[]> {
		return (await this.collection.find({}).toArray()) as unknown as IUser[];
	}

	async findById(id: string): Promise<IUser | null> {
		if (!ObjectId.isValid(id)) return null;
		return (await this.collection.findOne({
			_id: new ObjectId(id),
		})) as unknown as IUser | null;
	}

	async findByEmail(email: string): Promise<IUser | null> {
		return (await this.collection.findOne({
			email,
		})) as unknown as IUser | null;
	}

	async findByUsername(username: string): Promise<IUser | null> {
		return (await this.collection.findOne({
			username,
		})) as unknown as IUser | null;
	}

	async findPublicById(id: string): Promise<IUser | null> {
		if (!ObjectId.isValid(id)) return null;
		return (await this.collection.findOne(
			{ _id: new ObjectId(id) },
			{
				projection: {
					password: 0,
				},
			},
		)) as unknown as IUser | null;
	}

	async findAllPaginated(
		query: UserQuery,
	): Promise<{ users: IUser[]; total: number }> {
		const page = query.page ?? 1;
		const limit = query.limit ?? 20;
		const skip = (page - 1) * limit;

		const filter: Record<string, unknown> = {};
		if (query.role) filter.role = query.role;
		if (query.search) {
			filter.$or = [
				{ username: { $regex: query.search, $options: "i" } },
				{ email: { $regex: query.search, $options: "i" } },
				{ fullName: { $regex: query.search, $options: "i" } },
			];
		}

		const [users, total] = await Promise.all([
			this.collection
				.find(filter, { projection: { password: 0 } })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.toArray(),
			this.collection.countDocuments(filter),
		]);

		return { users: users as unknown as IUser[], total };
	}

	async create(data: Partial<IUser>): Promise<IUser> {
		const payload = {
			...data,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		const result = await this.collection.insertOne(payload);
		return { ...(payload as IUser), _id: result.insertedId as never };
	}

	async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
		if (!ObjectId.isValid(id)) return null;
		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: { ...data, updatedAt: new Date() } },
			{ returnDocument: "after" },
		);
		return result as unknown as IUser | null;
	}

	async updateProfile(
		id: string,
		data: Partial<IUser>,
	): Promise<IUser | null> {
		if (!ObjectId.isValid(id)) return null;
		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: { ...data, updatedAt: new Date() } },
			{ returnDocument: "after", projection: { password: 0 } },
		);
		return result as unknown as IUser | null;
	}

	async delete(id: string): Promise<boolean> {
		if (!ObjectId.isValid(id)) return false;
		const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
		return result.deletedCount > 0;
	}
}
