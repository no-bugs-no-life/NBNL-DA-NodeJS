import { DashboardRepository } from "./dashboard.repository";
import type {
	ChartDataPoint,
	DashboardOverview,
	DashboardStats,
} from "./dashboard.types";

export class DashboardService {
	private repo: DashboardRepository;

	constructor(repo?: DashboardRepository) {
		this.repo = repo || new DashboardRepository();
	}

	async getStats(): Promise<DashboardStats> {
		return this.repo.getStats();
	}

	async getOverview(): Promise<DashboardOverview> {
		const [stats, recentOrders] = await Promise.all([
			this.repo.getStats(),
			this.repo.getRecentOrders(10),
		]);

		return {
			stats,
			recentOrders: recentOrders.map((order) => ({
				_id: order._id.toString(),
				totalAmount: order.totalAmount,
				status: order.status,
				createdAt: order.createdAt,
			})),
			topApps: [], // TODO: implement if needed
		};
	}

	async getRevenueChart(days = 30): Promise<ChartDataPoint[]> {
		return this.repo.getRevenueChart(days);
	}

	async getUsersChart(days = 30): Promise<ChartDataPoint[]> {
		return this.repo.getUsersChart(days);
	}
}
