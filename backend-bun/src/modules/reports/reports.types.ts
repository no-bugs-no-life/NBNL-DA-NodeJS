import { ObjectId } from "mongoose";

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
	reporterId: ObjectId;
	targetType: ReportTargetType;
	targetId: ObjectId;
	reason: string;
	description?: string;
	status: ReportStatus;
	adminNote?: string;
	resolvedBy?: ObjectId;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IReportPublic {
	id: string;
	reporterId: string;
	targetType: ReportTargetType;
	targetId: string;
	reason: string;
	description?: string;
	status: ReportStatus;
	adminNote?: string;
	resolvedBy?: string;
	createdAt: Date;
	updatedAt?: Date;
}

export interface IReportCreate {
	reporterId: string;
	targetType: ReportTargetType;
	targetId: string;
	reason: string;
	description?: string;
}

export interface IReportUpdate {
	status?: ReportStatus;
	adminNote?: string;
}

export interface ReportQuery {
	page?: number;
	limit?: number;
	reporterId?: string;
	targetType?: ReportTargetType;
	status?: ReportStatus;
}