import { notFound } from "@/shared/errors";
import { AnalyticsRepository } from "./analytics.repository";
import type {
    AnalyticsFilters,
    PaginatedAnalytics,
    AnalyticsSummary,
    AnalyticsWithRelations
} from "./analytics.types";
import type { UpdateAnalyticsRequest } from "./analytics.schema";

export class AnalyticsService {
    private readonly repository = new AnalyticsRepository();

    async getAnalytics(filters: AnalyticsFilters, page: number, limit: number): Promise<PaginatedAnalytics> {
        return await this.repository.findAll(filters, page, limit);
    }

    async getSummaryByAppId(appId: string): Promise<AnalyticsSummary> {
        const summary = await this.repository.findSummaryByAppId(appId);
        if (!summary) throw notFound("Không tìm thấy dữ liệu phân tích tập hợp cho ứng dụng này");
        return summary;
    }

    async getAnalyticsById(id: string): Promise<AnalyticsWithRelations> {
        const record = await this.repository.findById(id);
        if (!record) throw notFound("Bản ghi phân tích không tồn tại");
        return record;
    }

    async updateAnalytics(id: string, data: UpdateAnalyticsRequest): Promise<AnalyticsWithRelations> {
        const updated = await this.repository.update(id, data);
        if (!updated) throw notFound("Cập nhật thất bại, không tìm thấy bản ghi");
        const record = await this.repository.findById(id);
        if (!record) throw notFound("Tải lại bản ghi phân tích thất bại");
        return record;
    }

    async deleteAnalytics(id: string): Promise<void> {
        const deleted = await this.repository.delete(id);
        if (!deleted) throw notFound("Xoá thất bại, không tìm thấy bản ghi");
    }
}
