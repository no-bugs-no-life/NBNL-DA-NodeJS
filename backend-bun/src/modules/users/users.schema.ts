import { z } from "zod";
import { UserRole } from "./users.types";

// Register Schema
export const RegisterSchema = z
	.object({
		username: z
			.string()
			.min(3, "Username tối thiểu 3 ký tự")
			.max(30, "Username tối đa 30 ký tự")
			.regex(/^[a-zA-Z0-9_]+$/, "Username chỉ chứa chữ, số và dấu gạch dưới"),
		email: z.string().email("Email không hợp lệ"),
		password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
		fullName: z.string().optional(),
	})
	.strict();

export type RegisterRequest = z.infer<typeof RegisterSchema>;

// Update Profile Schema
export const UpdateProfileSchema = z
	.object({
		fullName: z.string().max(100).optional(),
		avatar: z.string().url().optional(),
		bio: z.string().max(500).optional(),
		cover: z.string().url().optional(),
		socialLinks: z
			.object({
				facebook: z.string().url().optional(),
				twitter: z.string().url().optional(),
				github: z.string().url().optional(),
				linkedin: z.string().url().optional(),
				website: z.string().url().optional(),
			})
			.optional(),
	})
	.strict();

export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;

// Query Schema
export const UserQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	search: z.string().optional(),
	role: z.nativeEnum(UserRole).optional(),
});

export type UserQueryRequest = z.infer<typeof UserQuerySchema>;
