import type { Context } from "hono";
import { ok } from "@/shared/utils/api-response.util";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
	private service: DashboardService;

	constructor(service?: DashboardService) {
		this.service = service || new DashboardService();
	}

	async getStats(c: Context) {
		const stats = await this.service.getStats();
		return c.json(ok(stats));
	}

	async getOverview(c: Context) {
		const overview = await this.service.getOverview();
		return c.json(ok(overview));
	}

	async getRevenueChart(c: Context) {
		const days = Number(c.req.query("days")) || 30;
		const chart = await this.service.getRevenueChart(days);
		return c.json(ok(chart));
	}

	async getUsersChart(c: Context) {
		const days = Number(c.req.query("days")) || 30;
		const chart = await this.service.getUsersChart(days);
		return c.json(ok(chart));
	}
}
