import { z } from "zod";
import { ReportTargetType, ReportStatus } from "./reports.types";

// Create Report Schema
export const CreateReportSchema = z
	.object({
		targetType: z.nativeEnum(ReportTargetType),
		targetId: z.string().min(1, "ID mục tiêu không được để trống"),
		reason: z
			.string()
			.min(5, "Lý do báo cáo tối thiểu 5 ký tự")
			.max(200, "Lý do báo cáo tối đa 200 ký tự"),
		description: z
			.string()
			.max(1000, "Mô tả tối đa 1000 ký tự")
			.optional(),
	})
	.strict();

export type CreateReportRequest = z.infer<typeof CreateReportSchema>;

// Update Report Schema (Admin only)
export const UpdateReportSchema = z
	.object({
		status: z.nativeEnum(ReportStatus).optional(),
		adminNote: z
			.string()
			.max(500, "Ghi chú admin tối đa 500 ký tự")
			.optional(),
	})
	.strict();

export type UpdateReportRequest = z.infer<typeof UpdateReportSchema>;

// Query Schema
export const ReportQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	reporterId: z.string().optional(),
	targetType: z.nativeEnum(ReportTargetType).optional(),
	status: z.nativeEnum(ReportStatus).optional(),
});

export type ReportQueryRequest = z.infer<typeof ReportQuerySchema>;