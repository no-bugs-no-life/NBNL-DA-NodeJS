import { badRequest, notFound } from "@/shared/errors";
import { ReportsRepository } from "./reports.repository";
import type { CreateReportRequest } from "./reports.schema";
import type {
	IReport,
	PaginatedReportsResponse,
	ReportItemResponse,
	ReportQuery,
} from "./reports.types";
import { ReportStatus } from "./reports.types";

export class ReportsService {
	private readonly repository = new ReportsRepository();

	async create(
		data: CreateReportRequest,
		reporter: string,
	): Promise<ReportItemResponse> {
		const existingReports = await this.repository.findByTarget(
			data.targetType,
			data.target,
		);
		const duplicate = existingReports.find(
			(r) =>
				r.reporter.toString() === reporter &&
				r.status === ReportStatus.PENDING,
		);
		if (duplicate) {
			throw badRequest("Bạn đã báo cáo mục này rồi và đang chờ xử lý");
		}

		const report = await this.repository.create({
			reporter: reporter as unknown as IReport["reporter"],
			targetType: data.targetType,
			target: data.target as unknown as IReport["target"],
			reason: data.reason,
			status: ReportStatus.PENDING,
		});

		return this.toResponse(report);
	}

	async getById(id: string): Promise<ReportItemResponse> {
		const report = await this.repository.findById(id);
		if (!report) throw notFound("Báo cáo không tồn tại");
		return this.toResponse(report);
	}

	async getAllPaginated(
		page: number,
		limit: number,
		status?: string,
		targetType?: string,
	): Promise<PaginatedReportsResponse> {
		const query: ReportQuery = { page, limit };
		if (status) query.status = status as ReportStatus;
		// biome-ignore lint/suspicious/noExplicitAny: Filter types
		if (targetType) query.targetType = targetType as any;

		const { reports, total } = await this.repository.findAllPaginated(query);
		return {
			docs: reports.map((r) => this.toResponse(r)),
			totalDocs: total,
			limit,
			totalPages: Math.ceil(total / limit),
			page,
		};
	}

	async updateStatus(
		id: string,
		status: ReportStatus,
		adminNote?: string,
	): Promise<ReportItemResponse> {
		const report = await this.repository.findById(id);
		if (!report) throw notFound("Báo cáo không tồn tại");

		if (status === ReportStatus.PENDING) {
			throw badRequest("Không thể chuyển về trạng thái đang chờ");
		}

		const updated = await this.repository.updateStatus(id, status, adminNote);
		if (!updated) throw notFound("Báo cáo không tồn tại");
		return this.toResponse(updated);
	}

	async delete(id: string): Promise<boolean> {
		const report = await this.repository.findById(id);
		if (!report) throw notFound("Báo cáo không tồn tại");
		return this.repository.delete(id);
	}

	private toResponse(report: IReport): ReportItemResponse {
		return {
			_id: report._id?.toString() ?? "",
			reporter: {
				_id: report.reporter,
				fullName: "",
				email: "",
				avatarUrl: undefined,
			},
			targetType: report.targetType,
			target: report.target,
			reason: report.reason,
			status: report.status,
			adminNote: report.adminNote ?? "",
			createdAt: report.createdAt?.toISOString() ?? new Date().toISOString(),
			updatedAt: report.updatedAt?.toISOString() ?? new Date().toISOString(),
		};
	}
}
