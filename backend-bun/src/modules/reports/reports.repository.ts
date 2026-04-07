import type { IReport, ReportQuery, ReportStatus } from "./reports.types";
import type { IBaseRepository } from "@/shared/base";

export interface IReportRepository extends IBaseRepository<IReport> {
	findByReporter(reporterId: string): Promise<IReport[]>;
	findByTarget(targetType: string, targetId: string): Promise<IReport[]>;
	findAllPaginated(query: ReportQuery): Promise<{ reports: IReport[]; total: number }>;
	updateStatus(id: string, status: ReportStatus, adminNote?: string, resolvedBy?: string): Promise<IReport | null>;
}

export class ReportsRepository implements IReportRepository {
	async findAll(): Promise<IReport[]> {
		// TODO: Implement with MongoDB
		return [];
	}

	async findById(id: string): Promise<IReport | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async findByReporter(reporterId: string): Promise<IReport[]> {
		// TODO: Implement with MongoDB
		return [];
	}

	async findByTarget(targetType: string, targetId: string): Promise<IReport[]> {
		// TODO: Implement with MongoDB - find all reports for specific target
		return [];
	}

	async findAllPaginated(query: ReportQuery): Promise<{ reports: IReport[]; total: number }> {
		// TODO: Implement with MongoDB
		return { reports: [], total: 0 };
	}

	async create(data: Partial<IReport>): Promise<IReport> {
		// TODO: Implement with MongoDB
		return {} as IReport;
	}

	async update(id: string, data: Partial<IReport>): Promise<IReport | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async updateStatus(
		id: string,
		status: ReportStatus,
		adminNote?: string,
		resolvedBy?: string,
	): Promise<IReport | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async delete(id: string): Promise<boolean> {
		// TODO: Implement with MongoDB - soft delete
		return false;
	}
}
