// Dashboard Stats Types

export interface DashboardStats {
	// User metrics
	totalUsers: number;
	newUsersThisMonth: number;

	// App metrics
	totalApps: number;
	publishedApps: number;
	pendingApps: number;
	rejectedApps: number;
	archivedApps: number;

	// Revenue metrics
	totalRevenue: number;
	revenueThisMonth: number;
	totalOrders: number;
	ordersThisMonth: number;

	// Download metrics
	totalDownloads: number;
	downloadsThisMonth: number;

	// Additional stats
	totalReviews: number;
	avgRating: number;
	reportsPending: number;
}

export interface ChartDataPoint {
	date: string;
	value: number;
}

export interface DashboardOverview {
	stats: DashboardStats;
	recentOrders: Array<{
		_id: string;
		totalAmount: number;
		status: string;
		createdAt: Date;
		user?: { _id: string; username: string; fullName: string };
	}>;
	topApps: Array<{
		_id: string;
		name: string;
		downloadCount: number;
		revenue: number;
	}>;
}
