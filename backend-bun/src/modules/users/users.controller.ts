import type { Context } from "hono";
import { BaseController } from "@/shared/base";
import {
	RegisterSchema,
	UpdateProfileSchema,
	UserQuerySchema,
} from "./users.schema";
import { UsersService } from "./users.service";
import type { UserRole } from "./users.types";

export class UsersController extends BaseController {
	private readonly usersService = new UsersService();

	async register(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = RegisterSchema.parse(data);

		const user = await this.usersService.register(validated);
		return c.json(this.ok(user, "Đăng ký thành công"), 201);
	}

	async getProfile(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		const user = await this.usersService.getById(payload.id);
		return c.json(this.ok(user, "Thông tin người dùng"));
	}

	async getById(c: Context) {
		const { id } = c.req.param();
		const user = await this.usersService.getById(id);
		return c.json(this.ok(user));
	}

	async getAll(c: Context) {
		const query = UserQuerySchema.parse(c.req.query());
		const { users, total } = await this.usersService.getAll(query);

		return c.json(
			this.paginated(users, total, query.page ?? 1, query.limit ?? 20),
		);
	}

	async updateProfile(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = UpdateProfileSchema.parse(data);

		const user = await this.usersService.updateProfile(payload.id, validated);
		return c.json(this.ok(user, "Cập nhật hồ sơ thành công"));
	}

	async updateRole(c: Context) {
		const { id } = c.req.param();
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		const { role } = await c.req.json<{ role: UserRole }>();
		const user = await this.usersService.updateRole(
			payload.id,
			id,
			role,
			payload.role as UserRole,
		);
		return c.json(this.ok(user, "Cập nhật vai trò thành công"));
	}

	async deleteUser(c: Context) {
		const { id } = c.req.param();
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		await this.usersService.deleteUser(
			payload.id,
			id,
			payload.role as UserRole,
		);
		return c.json(this.ok(null, "Xóa người dùng thành công"));
	}
}
