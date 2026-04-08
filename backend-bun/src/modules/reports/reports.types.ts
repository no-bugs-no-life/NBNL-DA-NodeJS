import type { ObjectId } from "mongoose";

export enum ReportTargetType {
	APP = "app",
	REVIEW = "review",
}

export enum ReportStatus {
	PENDING = "pending",
	REVIEWED = "reviewed",
	RESOLVED = "resolved",
	DISMISSED = "dismissed",
}

export interface IReport {
	_id?: ObjectId;
	reporter: ObjectId;
	targetType: ReportTargetType;
	target: ObjectId;
	reason: string;
	status: ReportStatus;
	adminNote?: string;
	resolvedBy?: ObjectId;
	createdAt?: Date;
	updatedAt?: Date;
}

// API Response Types - matching frontend
export interface ReporterInfo {
	_id: ObjectId;
	fullName: string;
	email: string;
	avatarUrl?: string;
}

export interface ReportItemResponse {
	_id: string;
	reporter: ReporterInfo;
	targetType: ReportTargetType;
	target: unknown;
	reason: string;
	status: ReportStatus;
	adminNote: string;
	createdAt: string;
	updatedAt: string;
}

export interface PaginatedReportsResponse {
	docs: ReportItemResponse[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
}

export interface CreateReportDTO {
	targetType: ReportTargetType;
	target: string;
	reason: string;
}

export interface UpdateReportDTO {
	status?: ReportStatus;
	adminNote?: string;
}

export interface ReportQuery {
	page?: number;
	limit?: number;
	status?: ReportStatus;
	targetType?: ReportTargetType;
}
