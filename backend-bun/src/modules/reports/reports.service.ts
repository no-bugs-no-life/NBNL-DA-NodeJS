import { ReportsRepository } from "./reports.repository";
import { badRequest, notFound, forbidden } from "@/shared/errors";
import type { IReport, IReportPublic, ReportQuery } from "./reports.types";
import type { CreateReportRequest, UpdateReportRequest } from "./reports.schema";
import { ReportStatus } from "./reports.types";

export class ReportsService {
	private readonly repository = new ReportsRepository();

	async create(data: CreateReportRequest, reporterId: string): Promise<IReportPublic> {
		// Check for duplicate report
		const existingReports = await this.repository.findByTarget(
			data.targetType,
			data.targetId,
		);
		const duplicate = existingReports.find(
			(r) => r.reporterId.toString() === reporterId && r.status === ReportStatus.PENDING,
		);
		if (duplicate) {
			throw badRequest("Bạn đã báo cáo mục này rồi và đang chờ xử lý");
		}

		const report = await this.repository.create({
			...data,
			reporterId: reporterId as any,
			status: ReportStatus.PENDING,
		});

		return this.toPublic(report);
	}

	async getById(id: string): Promise<IReportPublic> {
		const report = await this.repository.findById(id);
		if (!report) throw notFound("Báo cáo không tồn tại");
		return this.toPublic(report);
	}

	async getByReporter(reporterId: string): Promise<IReportPublic[]> {
		const reports = await this.repository.findByReporter(reporterId);
		return reports.map((r) => this.toPublic(r));
	}

	async getAll(query: ReportQuery): Promise<{ reports: IReportPublic[]; total: number }> {
		const { reports, total } = await this.repository.findAllPaginated(query);
		return { reports: reports.map((r) => this.toPublic(r)), total };
	}

	async updateStatus(
		id: string,
		data: UpdateReportRequest,
		adminId: string,
	): Promise<IReportPublic> {
		const report = await this.repository.findById(id);
		if (!report) throw notFound("Báo cáo không tồn tại");

		// Validate status transition
		if (data.status === ReportStatus.PENDING) {
			throw badRequest("Không thể chuyển về trạng thái đang chờ");
		}

		const updated = await this.repository.updateStatus(
			id,
			data.status ?? report.status,
			data.adminNote,
			adminId,
		);

		if (!updated) throw notFound("Báo cáo không tồn tại");
		return this.toPublic(updated);
	}

	async delete(id: string): Promise<boolean> {
		const report = await this.repository.findById(id);
		if (!report) throw notFound("Báo cáo không tồn tại");
		return this.repository.delete(id);
	}

	private toPublic(report: IReport): IReportPublic {
		return {
			id: report._id?.toString() ?? "",
			reporterId: report.reporterId.toString(),
			targetType: report.targetType,
			targetId: report.targetId.toString(),
			reason: report.reason,
			description: report.description,
			status: report.status,
			adminNote: report.adminNote,
			resolvedBy: report.resolvedBy?.toString(),
			createdAt: report.createdAt!,
			updatedAt: report.updatedAt,
		};
	}
}
