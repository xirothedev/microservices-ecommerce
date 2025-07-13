"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Ban, Calendar, DollarSign, Edit, Mail, Phone, Save, ShoppingCart, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface UserProfile {
	id: string;
	name: string;
	email: string;
	phone?: string;
	avatar: string;
	status: "active" | "inactive" | "banned";
	credits: number;
	joinDate: string;
	lastActivity: string;
	totalOrders: number;
	totalSpent: number;
	role: "user" | "premium" | "admin";
}

interface ActivityLog {
	id: string;
	action: string;
	description: string;
	timestamp: string;
	ipAddress?: string;
}

interface Order {
	id: string;
	service: string;
	amount: number;
	status: "completed" | "pending" | "cancelled";
	date: string;
}

interface UserProfileModalProps {
	user: UserProfile | null;
	isOpen: boolean;
	onClose: () => void;
	onAdjustCredits: (userId: string, newCredits: number) => Promise<void>;
	onBanUser: (userId: string) => void;
	onDeleteUser: (userId: string) => void;
}

const mockActivityLogs: ActivityLog[] = [
	{
		id: "1",
		action: "login",
		description: "User logged in",
		timestamp: "2024-01-15T14:30:00Z",
		ipAddress: "192.168.1.100",
	},
	{
		id: "2",
		action: "purchase",
		description: "Purchased Apple ID Premium Setup",
		timestamp: "2024-01-15T12:15:00Z",
		ipAddress: "192.168.1.100",
	},
	{
		id: "3",
		action: "profile_update",
		description: "Updated profile information",
		timestamp: "2024-01-14T16:45:00Z",
		ipAddress: "192.168.1.100",
	},
	{
		id: "4",
		action: "password_change",
		description: "Changed account password",
		timestamp: "2024-01-13T10:20:00Z",
		ipAddress: "192.168.1.100",
	},
	{
		id: "5",
		action: "support_ticket",
		description: "Created support ticket #TKT-123456",
		timestamp: "2024-01-12T14:30:00Z",
		ipAddress: "192.168.1.100",
	},
];

const mockOrders: Order[] = [
	{
		id: "ORD-001",
		service: "Apple ID Premium Setup",
		amount: 49.99,
		status: "completed",
		date: "2024-01-15T12:15:00Z",
	},
	{
		id: "ORD-002",
		service: "Social Media Management",
		amount: 99.99,
		status: "completed",
		date: "2024-01-10T09:30:00Z",
	},
	{
		id: "ORD-003",
		service: "SEO Optimization",
		amount: 149.99,
		status: "pending",
		date: "2024-01-08T15:45:00Z",
	},
];

export default function UserProfileModal({
	user,
	isOpen,
	onClose,
	onAdjustCredits,
	onBanUser,
	onDeleteUser,
}: UserProfileModalProps) {
	const [activityLogs, _setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
	const [orders, _setOrders] = useState<Order[]>(mockOrders);
	const [isEditingCredits, setIsEditingCredits] = useState(false);
	const [newCredits, setNewCredits] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user) {
			setNewCredits(user.credits.toString());
		}
	}, [user]);

	if (!user) return null;

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
			case "inactive":
				return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Inactive</Badge>;
			case "banned":
				return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Banned</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	const getRoleBadge = (role: string) => {
		switch (role) {
			case "admin":
				return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>;
			case "premium":
				return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Premium</Badge>;
			case "user":
				return <Badge variant="outline">User</Badge>;
			default:
				return <Badge variant="secondary">{role}</Badge>;
		}
	};

	const getOrderStatusBadge = (status: string) => {
		switch (status) {
			case "completed":
				return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
			case "pending":
				return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
			case "cancelled":
				return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	const getActivityIcon = (action: string) => {
		switch (action) {
			case "login":
				return "🔐";
			case "purchase":
				return "🛒";
			case "profile_update":
				return "👤";
			case "password_change":
				return "🔑";
			case "support_ticket":
				return "🎫";
			default:
				return "📝";
		}
	};

	const handleSaveCredits = async () => {
		if (!newCredits || isNaN(Number(newCredits))) return;

		setLoading(true);
		await onAdjustCredits(user.id, Number(newCredits));
		setIsEditingCredits(false);
		setLoading(false);
	};

	const handleBan = async () => {
		setLoading(true);
		await onBanUser(user.id);
		setLoading(false);
	};

	const handleDelete = async () => {
		setLoading(true);
		await onDeleteUser(user.id);
		onClose();
		setLoading(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[60vw]">
				<DialogHeader>
					<DialogTitle>User Profile</DialogTitle>
					<DialogDescription>View and manage user account details and activity</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* User Header */}
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-start gap-6">
								<Avatar className="h-20 w-20">
									<AvatarImage
										src={
											user.avatar ||
											"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
										}
									/>
									<AvatarFallback className="text-lg">
										{user.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<div className="mb-2 flex items-center gap-3">
										<h2 className="text-2xl font-bold">{user.name}</h2>
										{getStatusBadge(user.status)}
										{getRoleBadge(user.role)}
									</div>
									<div className="space-y-1 text-sm text-gray-600">
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4" />
											{user.email}
										</div>
										{user.phone && (
											<div className="flex items-center gap-2">
												<Phone className="h-4 w-4" />
												{user.phone}
											</div>
										)}
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4" />
											Joined {formatDate(user.joinDate)}
										</div>
										<div className="flex items-center gap-2">
											<Activity className="h-4 w-4" />
											Last active {formatDate(user.lastActivity)}
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="mb-1 text-sm text-gray-600">Account Credits</div>
									<div className="flex items-center gap-2">
										{isEditingCredits ? (
											<div className="flex items-center gap-2">
												<Input
													type="number"
													value={newCredits}
													onChange={(e) => setNewCredits(e.target.value)}
													className="h-8 w-24"
													step="0.01"
												/>
												<Button size="sm" onClick={handleSaveCredits} disabled={loading}>
													<Save className="h-3 w-3" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onClick={() => {
														setIsEditingCredits(false);
														setNewCredits(user.credits.toString());
													}}
												>
													<X className="h-3 w-3" />
												</Button>
											</div>
										) : (
											<div className="flex items-center gap-2">
												<span className="text-2xl font-bold text-green-600">
													{formatCurrency(user.credits)}
												</span>
												<Button
													size="sm"
													variant="ghost"
													onClick={() => setIsEditingCredits(true)}
												>
													<Edit className="h-3 w-3" />
												</Button>
											</div>
										)}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<Card>
							<CardContent>
								<div className="flex items-center gap-3">
									<div className="rounded-lg bg-blue-100 p-2">
										<ShoppingCart className="h-5 w-5 text-blue-600" />
									</div>
									<div>
										<div className="text-2xl font-bold">{user.totalOrders}</div>
										<div className="text-sm text-gray-600">Total Orders</div>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent>
								<div className="flex items-center gap-3">
									<div className="rounded-lg bg-green-100 p-2">
										<DollarSign className="h-5 w-5 text-green-600" />
									</div>
									<div>
										<div className="text-2xl font-bold">{formatCurrency(user.totalSpent)}</div>
										<div className="text-sm text-gray-600">Total Spent</div>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent>
								<div className="flex items-center gap-3">
									<div className="rounded-lg bg-purple-100 p-2">
										<Activity className="h-5 w-5 text-purple-600" />
									</div>
									<div>
										<div className="text-2xl font-bold">{activityLogs.length}</div>
										<div className="text-sm text-gray-600">Activities</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Tabs */}
					<Tabs defaultValue="activity" className="space-y-4">
						<TabsList>
							<TabsTrigger value="activity">Activity Log</TabsTrigger>
							<TabsTrigger value="orders">Order History</TabsTrigger>
							<TabsTrigger value="actions">Admin Actions</TabsTrigger>
						</TabsList>

						<TabsContent value="activity" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Recent Activity</CardTitle>
									<CardDescription>User&apos;s recent actions and system events</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{activityLogs.map((log, index) => (
											<motion.div
												key={log.id}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ duration: 0.3, delay: index * 0.1 }}
												className="flex items-center gap-4 rounded-lg bg-gray-50 p-3"
											>
												<div className="text-2xl">{getActivityIcon(log.action)}</div>
												<div className="flex-1">
													<div className="font-medium">{log.description}</div>
													<div className="flex items-center gap-2 text-sm text-gray-600">
														<span>{formatDate(log.timestamp)}</span>
														{log.ipAddress && (
															<>
																<span>•</span>
																<span>IP: {log.ipAddress}</span>
															</>
														)}
													</div>
												</div>
											</motion.div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="orders" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Order History</CardTitle>
									<CardDescription>Complete list of user&apos;s orders and purchases</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Order ID</TableHead>
												<TableHead>Service</TableHead>
												<TableHead>Amount</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Date</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{orders.map((order) => (
												<TableRow key={order.id}>
													<TableCell className="font-medium">{order.id}</TableCell>
													<TableCell>{order.service}</TableCell>
													<TableCell>{formatCurrency(order.amount)}</TableCell>
													<TableCell>{getOrderStatusBadge(order.status)}</TableCell>
													<TableCell>{formatDate(order.date)}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="actions" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Administrative Actions</CardTitle>
									<CardDescription>Manage user account and permissions</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<Button
											variant="outline"
											onClick={handleBan}
											disabled={loading}
											className={
												user.status === "banned"
													? "border-green-200 text-green-700 hover:bg-green-50"
													: "border-orange-200 text-orange-700 hover:bg-orange-50"
											}
										>
											<Ban className="mr-2 h-4 w-4" />
											{user.status === "banned" ? "Unban User" : "Ban User"}
										</Button>
										<Button variant="destructive" onClick={handleDelete} disabled={loading}>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete Account
										</Button>
									</div>
									<Separator />
									<div className="text-sm text-gray-600">
										<p className="mb-2">
											<strong>Note:</strong> Administrative actions are logged and cannot be
											undone.
										</p>
										<ul className="list-inside list-disc space-y-1">
											<li>Banning a user will prevent them from accessing their account</li>
											<li>Deleting an account will permanently remove all user data</li>
											<li>Credit adjustments are applied immediately</li>
											<li>Profile information can only be modified by the user</li>
										</ul>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</DialogContent>
		</Dialog>
	);
}
