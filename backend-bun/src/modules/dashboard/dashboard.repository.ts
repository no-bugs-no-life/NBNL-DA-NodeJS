import mongoose from "mongoose";
import type { ChartDataPoint, DashboardStats } from "./dashboard.types";

export class DashboardRepository {
	private get db() {
		// biome-ignore lint/style/noNonNullAssertion: Required by mongoose
		return mongoose.connection.db!;
	}

	async getStats(): Promise<DashboardStats> {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		const [
			totalUsers,
			newUsersThisMonth,
			totalApps,
			publishedApps,
			pendingApps,
			rejectedApps,
			archivedApps,
			totalRevenue,
			revenueThisMonth,
			totalOrders,
			ordersThisMonth,
			totalReviews,
			reportsPending,
		] = await Promise.all([
			// Users
			this.db.collection("users").countDocuments({ isDeleted: { $ne: true } }),
			this.db.collection("users").countDocuments({
				createdAt: { $gte: startOfMonth },
				isDeleted: { $ne: true },
			}),

			// Apps
			this.db.collection("apps").countDocuments({ isDeleted: { $ne: true } }),
			this.db
				.collection("apps")
				.countDocuments({ status: "published", isDeleted: { $ne: true } }),
			this.db
				.collection("apps")
				.countDocuments({ status: "pending", isDeleted: { $ne: true } }),
			this.db
				.collection("apps")
				.countDocuments({ status: "rejected", isDeleted: { $ne: true } }),
			this.db
				.collection("apps")
				.countDocuments({ status: "archived", isDeleted: { $ne: true } }),

			// Revenue/Orders
			this.db
				.collection("orders")
				.aggregate([
					{ $match: { status: "completed" } },
					{ $group: { _id: null, total: { $sum: "$totalAmount" } } },
				])
				.toArray(),
			this.db
				.collection("orders")
				.aggregate([
					{
						$match: { status: "completed", createdAt: { $gte: startOfMonth } },
					},
					{ $group: { _id: null, total: { $sum: "$totalAmount" } } },
				])
				.toArray(),
			this.db.collection("orders").countDocuments(),
			this.db
				.collection("orders")
				.countDocuments({ createdAt: { $gte: startOfMonth } }),

			// Reviews
			this.db.collection("reviews").countDocuments({ status: "approved" }),

			// Reports
			this.db.collection("reports").countDocuments({ status: "pending" }),
		]);

		// Downloads - aggregate from versions or orders
		const downloadsAgg = await this.db
			.collection("orders")
			.aggregate([
				{ $match: { status: "completed" } },
				{ $unwind: "$items" },
				{ $group: { _id: null, total: { $sum: 1 } } },
			])
			.toArray();

		const downloadsThisMonthAgg = await this.db
			.collection("orders")
			.aggregate([
				{ $match: { status: "completed", createdAt: { $gte: startOfMonth } } },
				{ $unwind: "$items" },
				{ $group: { _id: null, total: { $sum: 1 } } },
			])
			.toArray();

		return {
			totalUsers,
			newUsersThisMonth,
			totalApps,
			publishedApps,
			pendingApps,
			rejectedApps,
			archivedApps,
			totalRevenue: totalRevenue[0]?.total || 0,
			revenueThisMonth: revenueThisMonth[0]?.total || 0,
			totalOrders,
			ordersThisMonth,
			totalDownloads: downloadsAgg[0]?.total || 0,
			downloadsThisMonth: downloadsThisMonthAgg[0]?.total || 0,
			totalReviews,
			avgRating: 0, // Calculate from reviews if needed
			reportsPending,
		};
	}

	async getRevenueChart(days = 30): Promise<ChartDataPoint[]> {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);

		const result = await this.db
			.collection("orders")
			.aggregate([
				{
					$match: {
						status: "completed",
						createdAt: { $gte: startDate },
					},
				},
				{
					$group: {
						_id: {
							$dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
						},
						value: { $sum: "$totalAmount" },
					},
				},
				{ $sort: { _id: 1 } },
			])
			.toArray();

		return result.map((r) => ({ date: r._id, value: r.value }));
	}

	async getUsersChart(days = 30): Promise<ChartDataPoint[]> {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);

		const result = await this.db
			.collection("users")
			.aggregate([
				{
					$match: {
						createdAt: { $gte: startDate },
						isDeleted: { $ne: true },
					},
				},
				{
					$group: {
						_id: {
							$dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
						},
						value: { $sum: 1 },
					},
				},
				{ $sort: { _id: 1 } },
			])
			.toArray();

		return result.map((r) => ({ date: r._id, value: r.value }));
	}

	async getRecentOrders(limit = 10) {
		return this.db
			.collection("orders")
			.find({})
			.sort({ createdAt: -1 })
			.limit(limit)
			.toArray();
	}
}
