import { z } from "zod";

export const LoginSchema = z.object({
	username: z.string().min(3),
	password: z.string().min(6),
});

export const ChangePasswordSchema = z.object({
	currentPassword: z.string().min(6),
	newPassword: z.string().min(6),
});

export const VerifyTwoFactorSchema = z.object({
	code: z.string().min(4).max(8),
});

export type LoginRequest = z.infer<typeof LoginSchema>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordSchema>;
export type VerifyTwoFactorRequest = z.infer<typeof VerifyTwoFactorSchema>;
