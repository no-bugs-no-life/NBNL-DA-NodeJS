import type { Context } from "hono";
import { BaseController } from "@/shared/base";
import { ReportsService } from "./reports.service";
import { CreateReportSchema, UpdateReportSchema, ReportQuerySchema } from "./reports.schema";

export class ReportsController extends BaseController {
	private readonly reportsService = new ReportsService();

	async create(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = CreateReportSchema.parse(data);

		const report = await this.reportsService.create(validated, payload.id);
		return c.json(this.ok(report, "Gửi báo cáo thành công"), 201);
	}

	async getMyReports(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		const reports = await this.reportsService.getByReporter(payload.id);
		return c.json(this.ok(reports));
	}

	async getAll(c: Context) {
		const query = ReportQuerySchema.parse(c.req.query());
		const { reports, total } = await this.reportsService.getAll(query);

		return c.json(
			this.paginated(reports, total, query.page ?? 1, query.limit ?? 20),
		);
	}

	async getById(c: Context) {
		const { id } = c.req.param();
		const report = await this.reportsService.getById(id);
		return c.json(this.ok(report));
	}

	async update(c: Context) {
		const payload = c.get("jwtPayload");
		if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

		const { id } = c.req.param();
		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = UpdateReportSchema.parse(data);

		const report = await this.reportsService.updateStatus(id, validated, payload.id);
		return c.json(this.ok(report, "Cập nhật báo cáo thành công"));
	}

	async delete(c: Context) {
		const { id } = c.req.param();
		await this.reportsService.delete(id);
		return c.json(this.ok(null, "Xóa báo cáo thành công"));
	}
}
