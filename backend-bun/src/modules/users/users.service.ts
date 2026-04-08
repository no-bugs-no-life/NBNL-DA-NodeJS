import { hash } from "bcryptjs";
import { badRequest, forbidden, notFound } from "@/shared/errors";
import { UsersRepository } from "./users.repository";
import type { RegisterRequest, UpdateProfileRequest } from "./users.schema";
import type { IUser, IUserPublic, UserQuery, UserRole } from "./users.types";

export class UsersService {
	private readonly repository = new UsersRepository();
	private readonly SALT_ROUNDS = 10;

	async register(data: RegisterRequest): Promise<IUserPublic> {
		const existingEmail = await this.repository.findByEmail(data.email);
		if (existingEmail) throw badRequest("Email đã được sử dụng");

		const existingUsername = await this.repository.findByUsername(
			data.username,
		);
		if (existingUsername) throw badRequest("Username đã được sử dụng");

		const hashedPassword = await hash(data.password, this.SALT_ROUNDS);

		const user = await this.repository.create({
			...data,
			password: hashedPassword,
			role: "USER",
			coin: 0,
			level: 1,
			xp: 0,
			maxXp: 100,
		});

		return this.toPublic(user);
	}

	async getById(id: string): Promise<IUserPublic> {
		const user = await this.repository.findPublicById(id);
		if (!user) throw notFound("Người dùng không tồn tại");
		return this.toPublic(user);
	}

	async getByEmail(email: string): Promise<IUser | null> {
		return this.repository.findByEmail(email);
	}

	async getAll(
		query: UserQuery,
	): Promise<{ users: IUserPublic[]; total: number }> {
		const { users, total } = await this.repository.findAllPaginated(query);
		return { users: users.map((u) => this.toPublic(u)), total };
	}

	async updateProfile(
		id: string,
		data: UpdateProfileRequest,
	): Promise<IUserPublic> {
		const user = await this.repository.updateProfile(id, data);
		if (!user) throw notFound("Người dùng không tồn tại");
		return this.toPublic(user);
	}

	async updateRole(
		_userId: string,
		targetId: string,
		newRole: UserRole,
		requestingUserRole: UserRole,
	): Promise<IUserPublic> {
		if (!this.canManageRole(requestingUserRole, newRole)) {
			throw forbidden("Bạn không có quyền gán vai trò này");
		}

		const user = await this.repository.update(targetId, { role: newRole });
		if (!user) throw notFound("Người dùng không tồn tại");
		return this.toPublic(user);
	}

	async deleteUser(
		userId: string,
		targetId: string,
		requestingUserRole: UserRole,
	): Promise<boolean> {
		if (!this.canManageRole(requestingUserRole, "ADMIN")) {
			throw forbidden("Bạn không có quyền xóa người dùng");
		}

		if (userId === targetId) {
			throw badRequest("Không thể tự xóa tài khoản của mình");
		}

		return this.repository.delete(targetId);
	}

	async addBalance(
		targetId: string,
		amount: number,
		requestingUserRole: UserRole,
	): Promise<IUserPublic> {
		if (!this.canManageRole(requestingUserRole, "DEVELOPER")) {
			throw forbidden("Bạn không có quyền nạp số dư cho người dùng");
		}

		if (!Number.isInteger(amount) || amount <= 0) {
			throw badRequest("Số dư nạp phải là số nguyên dương");
		}

		const updated = await this.repository.incrementCoin(targetId, amount);
		if (!updated) throw notFound("Người dùng không tồn tại");
		return this.toPublic(updated);
	}

	private toPublic(user: IUser): IUserPublic {
		const { password: _, ...pub } = user as IUser & { password?: string };
		return pub as IUserPublic;
	}

	private canManageRole(
		requesterRole: UserRole,
		targetRole: UserRole,
	): boolean {
		const roleHierarchy: Record<UserRole, number> = {
			USER: 0,
			DEVELOPER: 1,
			MODERATOR: 2,
			ADMIN: 3,
		};
		return roleHierarchy[requesterRole] > roleHierarchy[targetRole];
	}
}
