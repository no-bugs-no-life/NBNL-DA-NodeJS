import { z } from "zod";
import { ReportStatus, ReportTargetType } from "./reports.types";

// Create Report Schema
export const CreateReportSchema = z
	.object({
		targetType: z.nativeEnum(ReportTargetType),
		target: z.string().min(1, "ID mục tiêu không được để trống"),
		reason: z
			.string()
			.min(5, "Lý do báo cáo tối thiểu 5 ký tự")
			.max(500, "Lý do báo cáo tối đa 500 ký tự"),
	})
	.strict();

export type CreateReportRequest = z.infer<typeof CreateReportSchema>;

// Update Report Status Schema (PUT /status)
export const UpdateReportStatusSchema = z
	.object({
		status: z.nativeEnum(ReportStatus),
		adminNote: z.string().max(500).optional(),
	})
	.strict();

export type UpdateReportStatusRequest = z.infer<
	typeof UpdateReportStatusSchema
>;

// Query Schema
export const ReportQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
	status: z.nativeEnum(ReportStatus).optional(),
	targetType: z.nativeEnum(ReportTargetType).optional(),
});

export type ReportQueryRequest = z.infer<typeof ReportQuerySchema>;
