import { ObjectId } from "mongodb";

export interface AnalyticsRecord {
    _id: string;
    appId: string;
    date: string;
    views: number;
    downloads: number;
    installs: number;
    activeUsers: number;
    ratingAverage: number;
    crashCount: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface AnalyticsWithRelations extends Omit<AnalyticsRecord, "appId"> {
    appId: {
        _id: string;
        name: string;
        iconUrl?: string;
    };
}

export interface AnalyticsSummary {
    appId: string;
    appName: string;
    totalViews: number;
    totalDownloads: number;
    totalInstalls: number;
    avgActiveUsers: number;
    avgRating: number;
    totalCrashes: number;
    recordCount: number;
}

export interface AnalyticsFilters {
    page?: number;
    limit?: number;
    appId?: string;
    startDate?: string;
    endDate?: string;
}

export interface PaginatedAnalytics {
    docs: AnalyticsWithRelations[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
}
