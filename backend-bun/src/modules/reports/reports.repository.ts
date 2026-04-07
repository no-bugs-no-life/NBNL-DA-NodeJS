import type { IBaseRepository } from "@/shared/base";
import type { IReport, ReportQuery, ReportStatus } from "./reports.types";

export interface IReportRepository extends IBaseRepository<IReport> {
	findByReporter(reporterId: string): Promise<IReport[]>;
	findByTarget(targetType: string, targetId: string): Promise<IReport[]>;
	findAllPaginated(
		query: ReportQuery,
	): Promise<{ reports: IReport[]; total: number }>;
	updateStatus(
		id: string,
		status: ReportStatus,
		adminNote?: string,
		resolvedBy?: string,
	): Promise<IReport | null>;
}

export class ReportsRepository implements IReportRepository {
	async findAll(): Promise<IReport[]> {
		// TODO: Implement with MongoDB
		return [];
	}

	async findById(_id: string): Promise<IReport | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async findByReporter(_reporterId: string): Promise<IReport[]> {
		// TODO: Implement with MongoDB
		return [];
	}

	async findByTarget(
		_targetType: string,
		_targetId: string,
	): Promise<IReport[]> {
		// TODO: Implement with MongoDB - find all reports for specific target
		return [];
	}

	async findAllPaginated(
		_query: ReportQuery,
	): Promise<{ reports: IReport[]; total: number }> {
		// TODO: Implement with MongoDB
		return { reports: [], total: 0 };
	}

	async create(_data: Partial<IReport>): Promise<IReport> {
		// TODO: Implement with MongoDB
		return {} as IReport;
	}

	async update(_id: string, _data: Partial<IReport>): Promise<IReport | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async updateStatus(
		_id: string,
		_status: ReportStatus,
		_adminNote?: string,
		_resolvedBy?: string,
	): Promise<IReport | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async delete(_id: string): Promise<boolean> {
		// TODO: Implement with MongoDB - soft delete
		return false;
	}
}
