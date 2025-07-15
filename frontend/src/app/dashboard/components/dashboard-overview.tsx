"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Activity,
	AlertCircle,
	CheckCircle,
	DollarSign,
	MessageSquare,
	Ticket,
	TrendingUp,
	UserPlus,
	Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface DashboardStats {
	totalUsers: number;
	activeUsers: number;
	totalTickets: number;
	openTickets: number;
	resolvedTickets: number;
	totalRevenue: number;
	monthlyGrowth: number;
}

interface RecentActivity {
	id: string;
	type: "user_registered" | "ticket_created" | "ticket_resolved" | "payment_received";
	description: string;
	timestamp: string;
	user?: {
		name: string;
		avatar: string;
	};
}

const mockStats: DashboardStats = {
	totalUsers: 1247,
	activeUsers: 892,
	totalTickets: 456,
	openTickets: 23,
	resolvedTickets: 433,
	totalRevenue: 45670,
	monthlyGrowth: 12.5,
};

const mockRecentActivity: RecentActivity[] = [
	{
		id: "1",
		type: "user_registered",
		description: "New user registered",
		timestamp: "2024-01-15T14:30:00Z",
		user: {
			name: "Alice Johnson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
	},
	{
		id: "2",
		type: "ticket_created",
		description: "New support ticket created",
		timestamp: "2024-01-15T14:15:00Z",
		user: {
			name: "Bob Smith",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
	},
	{
		id: "3",
		type: "ticket_resolved",
		description: "Support ticket resolved",
		timestamp: "2024-01-15T13:45:00Z",
		user: {
			name: "Carol Davis",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
	},
	{
		id: "4",
		type: "payment_received",
		description: "Payment received for Apple ID Premium Setup",
		timestamp: "2024-01-15T13:20:00Z",
		user: {
			name: "David Wilson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
	},
	{
		id: "5",
		type: "user_registered",
		description: "New user registered",
		timestamp: "2024-01-15T12:55:00Z",
		user: {
			name: "Eva Martinez",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
	},
];

export default function DashboardOverview() {
	const [stats, setStats] = useState<DashboardStats>(mockStats);
	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(mockRecentActivity);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate API call
		const loadData = async () => {
			setLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setStats(mockStats);
			setRecentActivity(mockRecentActivity);
			setLoading(false);
		};

		loadData();
	}, []);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getActivityIcon = (type: string) => {
		switch (type) {
			case "user_registered":
				return <UserPlus className="h-4 w-4 text-blue-600" />;
			case "ticket_created":
				return <MessageSquare className="h-4 w-4 text-orange-600" />;
			case "ticket_resolved":
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case "payment_received":
				return <DollarSign className="h-4 w-4 text-purple-600" />;
			default:
				return <Activity className="h-4 w-4 text-gray-600" />;
		}
	};

	const getActivityColor = (type: string) => {
		switch (type) {
			case "user_registered":
				return "bg-blue-100";
			case "ticket_created":
				return "bg-orange-100";
			case "ticket_resolved":
				return "bg-green-100";
			case "payment_received":
				return "bg-purple-100";
			default:
				return "bg-gray-100";
		}
	};

	if (loading) {
		return (
			<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200" />
				))}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Users</CardTitle>
							<Users className="text-muted-foreground h-4 w-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
							<p className="text-muted-foreground text-xs">{stats.activeUsers} active users</p>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
							<Ticket className="text-muted-foreground h-4 w-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalTickets}</div>
							<p className="text-muted-foreground text-xs">
								{stats.openTickets} open, {stats.resolvedTickets} resolved
							</p>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
							<DollarSign className="text-muted-foreground h-4 w-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
							<p className="text-muted-foreground text-xs">This month</p>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
							<TrendingUp className="text-muted-foreground h-4 w-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">+{stats.monthlyGrowth}%</div>
							<p className="text-muted-foreground text-xs">From last month</p>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Recent Activity */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.5 }}
				>
					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>Latest system activities and user actions</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentActivity.map((activity) => (
									<div key={activity.id} className="flex items-center gap-4">
										<div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
											{getActivityIcon(activity.type)}
										</div>
										<div className="min-w-0 flex-1">
											<p className="text-sm font-medium text-gray-900">{activity.description}</p>
											<div className="mt-1 flex items-center gap-2">
												{activity.user && (
													<>
														<Avatar className="h-4 w-4">
															<AvatarImage
																src={
																	activity.user.avatar ||
																	"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
																}
															/>
															<AvatarFallback className="text-xs">
																{activity.user.name
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</AvatarFallback>
														</Avatar>
														<span className="text-xs text-gray-600">
															{activity.user.name}
														</span>
														<span className="text-xs text-gray-400">•</span>
													</>
												)}
												<span className="text-xs text-gray-500">
													{formatDate(activity.timestamp)}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Quick Actions */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
				>
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
							<CardDescription>Common administrative tasks</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-3">
								<Button variant="outline" className="h-auto justify-start bg-transparent p-4">
									<div className="flex items-center gap-3">
										<div className="rounded-lg bg-blue-100 p-2">
											<Users className="h-4 w-4 text-blue-600" />
										</div>
										<div className="text-left">
											<div className="font-medium">Manage Users</div>
											<div className="text-sm text-gray-600">View and manage user accounts</div>
										</div>
									</div>
								</Button>

								<Button variant="outline" className="h-auto justify-start bg-transparent p-4">
									<div className="flex items-center gap-3">
										<div className="rounded-lg bg-orange-100 p-2">
											<Ticket className="h-4 w-4 text-orange-600" />
										</div>
										<div className="text-left">
											<div className="font-medium">Review Tickets</div>
											<div className="text-sm text-gray-600">Handle support requests</div>
										</div>
									</div>
								</Button>

								<Button variant="outline" className="h-auto justify-start bg-transparent p-4">
									<div className="flex items-center gap-3">
										<div className="rounded-lg bg-red-100 p-2">
											<AlertCircle className="h-4 w-4 text-red-600" />
										</div>
										<div className="text-left">
											<div className="font-medium">System Alerts</div>
											<div className="text-sm text-gray-600">
												<Badge variant="destructive" className="text-xs">
													3 alerts
												</Badge>
											</div>
										</div>
									</div>
								</Button>

								<Button variant="outline" className="h-auto justify-start bg-transparent p-4">
									<div className="flex items-center gap-3">
										<div className="rounded-lg bg-green-100 p-2">
											<CheckCircle className="h-4 w-4 text-green-600" />
										</div>
										<div className="text-left">
											<div className="font-medium">Generate Reports</div>
											<div className="text-sm text-gray-600">Create system reports</div>
										</div>
									</div>
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
