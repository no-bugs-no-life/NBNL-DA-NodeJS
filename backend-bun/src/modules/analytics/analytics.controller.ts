import type { Context } from "hono";
import { BaseController } from "@/shared/base";
import { AnalyticsService } from "./analytics.service";
import type { AnalyticsQuery, UpdateAnalyticsRequest } from "./analytics.schema";

export class AnalyticsController extends BaseController {
    private readonly analyticsService = new AnalyticsService();

    // GET /analytics
    async list(c: Context) {
        // Extract query logic based on validated query
        const query = c.req.valid("query") as AnalyticsQuery;

        const filters = {
            appId: query.appId,
            startDate: query.startDate,
            endDate: query.endDate,
        };

        const page = query.page ?? 1;
        const limit = query.limit ?? 15;

        const data = await this.analyticsService.getAnalytics(filters, page, limit);
        return c.json(this.ok(data, "Lấy danh sách phân tích thành công"));
    }

    // GET /analytics/summary/:appId
    async getSummary(c: Context) {
        const appId = c.req.param("appId");
        if (!appId) return c.json(this.fail("Thiếu tham số appId"), 400);
        const summary = await this.analyticsService.getSummaryByAppId(appId);
        return c.json(this.ok(summary, "Lấy thông tin tổng phân tích thành công"));
    }

    // GET /analytics/:id
    async getById(c: Context) {
        const id = c.req.param("id");
        if (!id) return c.json(this.fail("Thiếu tham số id"), 400);
        const record = await this.analyticsService.getAnalyticsById(id);
        return c.json(this.ok(record, "Lấy thông tin bản ghi phân tích thành công"));
    }

    // PUT /analytics/:id
    async update(c: Context) {
        const id = c.req.param("id");
        if (!id) return c.json(this.fail("Thiếu tham số id"), 400);
        const data = c.req.valid("json") as UpdateAnalyticsRequest;

        const record = await this.analyticsService.updateAnalytics(id, data);
        return c.json(this.ok(record, "Cập nhật bản ghi phân tích thành công"));
    }

    // DELETE /analytics/:id
    async delete(c: Context) {
        const id = c.req.param("id");
        if (!id) return c.json(this.fail("Thiếu tham số id"), 400);
        await this.analyticsService.deleteAnalytics(id);
        return c.json(this.ok(null, "Xóa bản ghi phân tích thành công"));
    }
}
