"use client";
import useAuthStore from "@/store/useAuthStore";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

interface DashboardStats {
	totalUsers: number;
	newUsersThisMonth: number;
	totalApps: number;
	publishedApps: number;
	pendingApps: number;
	totalRevenue: number;
	revenueThisMonth: number;
	totalDownloads: number;
	downloadsThisMonth: number;
}

interface ChartDataPoint {
	date: string;
	value: number;
}

function formatNumber(num: number): string {
	if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
	if (num >= 1000) return (num / 1000).toFixed(1) + "K";
	return num.toString();
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function StatCard({
	title,
	value,
	icon,
	color,
}: {
	title: string;
	value: string;
	icon: string;
	color: string;
}) {
	return (
		<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
			<div
				className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}
			>
				<span className="material-symbols-outlined text-[28px]">{icon}</span>
			</div>
			<div>
				<p className="text-slate-500 text-sm font-semibold tracking-wide mb-1">
					{title}
				</p>
				<p className="text-3xl font-black text-slate-800 tracking-tight">
					{value}
				</p>
			</div>
		</div>
	);
}

function DashboardGrid({ stats }: { stats: DashboardStats | null }) {
	const isLoading = !stats;

	const cards = [
		{
			title: "Người dùng",
			value: isLoading ? "..." : formatNumber(stats.totalUsers),
			icon: "group",
			color: "bg-blue-50 text-blue-600",
		},
		{
			title: "Ứng dụng",
			value: isLoading ? "..." : formatNumber(stats.totalApps),
			icon: "apps",
			color: "bg-emerald-50 text-emerald-600",
		},
		{
			title: "Doanh thu",
			value: isLoading ? "..." : formatCurrency(stats.totalRevenue),
			icon: "payments",
			color: "bg-amber-50 text-amber-600",
		},
		{
			title: "Lượt tải",
			value: isLoading ? "..." : formatNumber(stats.totalDownloads),
			icon: "download",
			color: "bg-purple-50 text-purple-600",
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{cards.map((card, i) => (
				<StatCard key={i} {...card} />
			))}
		</div>
	);
}

function OverviewChart({
	revenueData,
	usersData,
}: {
	revenueData: ChartDataPoint[];
	usersData: ChartDataPoint[];
}) {
	const [activeTab, setActiveTab] = useState<"revenue" | "users">("revenue");

	const data = activeTab === "revenue" ? revenueData : usersData;
	const isDataEmpty = !data || data.length === 0;

	return (
		<div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] min-h-[460px] flex flex-col">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
				<h2 className="text-lg font-extrabold text-slate-800">Biểu đồ tổng quan</h2>
				<div className="flex bg-slate-100 p-1 rounded-xl">
					<button
						onClick={() => setActiveTab("revenue")}
						className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "revenue"
							? "bg-white text-amber-600 shadow-sm"
							: "text-slate-500 hover:text-slate-700"
							}`}
					>
						Doanh thu
					</button>
					<button
						onClick={() => setActiveTab("users")}
						className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "users"
							? "bg-white text-blue-600 shadow-sm"
							: "text-slate-500 hover:text-slate-700"
							}`}
					>
						Người dùng mới
					</button>
				</div>
			</div>

			<div className="flex-1 w-full h-[320px]">
				{isDataEmpty ? (
					<div className="w-full h-full bg-slate-50/50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
						<div className="text-center">
							<span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
								bar_chart
							</span>
							<p className="text-slate-400 font-medium text-sm">Chưa có dữ liệu</p>
						</div>
					</div>
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={data}
							margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="5%"
										stopColor={activeTab === "revenue" ? "#f59e0b" : "#2563eb"}
										stopOpacity={0.3}
									/>
									<stop
										offset="95%"
										stopColor={activeTab === "revenue" ? "#f59e0b" : "#2563eb"}
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<XAxis
								dataKey="date"
								axisLine={false}
								tickLine={false}
								tick={{ fill: "#94a3b8", fontSize: 12 }}
								dy={10}
								tickFormatter={(val) => {
									const d = new Date(val);
									return `${d.getDate()}/${d.getMonth() + 1}`;
								}}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fill: "#94a3b8", fontSize: 12 }}
								tickFormatter={(val) =>
									activeTab === "revenue"
										? `$${val >= 1000 ? (val / 1000).toFixed(1) + "k" : val}`
										: val
								}
								dx={-10}
							/>
							<CartesianGrid
								vertical={false}
								stroke="#e2e8f0"
								strokeDasharray="4 4"
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "#fff",
									borderRadius: "12px",
									border: "1px solid #e2e8f0",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
								}}
								itemStyle={{ color: "#1e293b", fontWeight: 600 }}
								labelFormatter={(label) => {
									const d = new Date(label as string);
									return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
								}}
								formatter={(value: any) => {
									const numValue = Number(value) || 0;
									if (activeTab === "revenue") return [formatCurrency(numValue), "Doanh thu"];
									return [numValue, "Người dùng mới"];
								}}
							/>
							<Area
								type="monotone"
								dataKey="value"
								stroke={activeTab === "revenue" ? "#f59e0b" : "#2563eb"}
								strokeWidth={3}
								fillOpacity={1}
								fill="url(#colorValue)"
								activeDot={{
									r: 6,
									strokeWidth: 0,
									fill: activeTab === "revenue" ? "#f59e0b" : "#2563eb",
								}}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
}

export default function DashboardPage() {
	const { isAdmin, isLoading, checkAuth } = useAuthStore();
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [revenueData, setRevenueData] = useState<ChartDataPoint[]>([]);
	const [usersData, setUsersData] = useState<ChartDataPoint[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!isAdmin()) return;

		const fetchDashboardData = async () => {
			try {
				const token = localStorage.getItem("accessToken");
				const headers = { Authorization: `Bearer ${token}` };

				const [statsRes, revenueRes, usersRes] = await Promise.all([
					fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, { headers }),
					fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/chart/revenue?days=30`, { headers }),
					fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/chart/users?days=30`, { headers }),
				]);

				const [statsJson, revenueJson, usersJson] = await Promise.all([
					statsRes.json(),
					revenueRes.json(),
					usersRes.json(),
				]);

				if (statsJson.success) setStats(statsJson.data);
				else setError(statsJson.msg);

				if (revenueJson.success) setRevenueData(revenueJson.data);
				if (usersJson.success) setUsersData(usersJson.data);

			} catch (err) {
				setError("Failed to fetch dashboard data");
				console.error(err);
			}
		};

		fetchDashboardData();
	}, [isAdmin]);

	if (!isLoading && !isAdmin()) {
		notFound();
	}

	if (isLoading) return null;

	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-black text-slate-800 tracking-tight">
					Tổng quan Hệ thống
				</h1>
				<p className="text-slate-500 mt-2 font-medium">
					Báo cáo hiệu suất, quản lý người dùng và doanh thu.
				</p>
			</div>
			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
					{error}
				</div>
			)}
			<DashboardGrid stats={stats} />
			<OverviewChart revenueData={revenueData} usersData={usersData} />
		</>
	);
}
