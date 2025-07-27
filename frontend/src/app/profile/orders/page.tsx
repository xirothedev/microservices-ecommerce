"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dayjs from "dayjs";
import {
	Calendar,
	ChevronDown,
	ChevronUp,
	DollarSign,
	Download,
	Eye,
	Package,
	Search,
	ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface OrderItem {
	id: string;
	productName: string;
	quantity: number;
	price: number;
}

interface Order {
	id: string;
	createdAt: string;
	totalPrice: number;
	status: "pending" | "processing" | "completed" | "cancelled";
	items: OrderItem[];
}

export default function OrdersContent() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

	// Mock orders data
	const orders: Order[] = [
		{
			id: "ORD-001",
			createdAt: "2024-01-15T10:30:00Z",
			totalPrice: 149.97,
			status: "completed",
			items: [
				{ id: "ITEM-001", productName: "Apple ID Premium Setup", quantity: 1, price: 49.99 },
				{ id: "ITEM-002", productName: "Facebook Business Account", quantity: 1, price: 79.99 },
				{ id: "ITEM-003", productName: "Instagram Growth Package", quantity: 1, price: 19.99 },
			],
		},
		{
			id: "ORD-002",
			createdAt: "2024-01-12T14:20:00Z",
			totalPrice: 99.98,
			status: "processing",
			items: [
				{ id: "ITEM-004", productName: "YouTube Premium Family", quantity: 2, price: 29.99 },
				{ id: "ITEM-005", productName: "LinkedIn Business Profile", quantity: 1, price: 39.99 },
			],
		},
		{
			id: "ORD-003",
			createdAt: "2024-01-10T09:15:00Z",
			totalPrice: 189.97,
			status: "completed",
			items: [
				{ id: "ITEM-006", productName: "Apple Developer Account", quantity: 1, price: 149.99 },
				{ id: "ITEM-007", productName: "TikTok Business Account", quantity: 1, price: 39.98 },
			],
		},
		{
			id: "ORD-004",
			createdAt: "2024-01-08T16:45:00Z",
			totalPrice: 69.99,
			status: "cancelled",
			items: [
				{ id: "ITEM-008", productName: "Netflix Premium Account", quantity: 1, price: 19.99 },
				{ id: "ITEM-009", productName: "Spotify Premium Setup", quantity: 1, price: 50.0 },
			],
		},
		{
			id: "ORD-005",
			createdAt: "2024-01-05T11:30:00Z",
			totalPrice: 259.96,
			status: "completed",
			items: [
				{ id: "ITEM-010", productName: "Complete Social Media Package", quantity: 1, price: 199.99 },
				{ id: "ITEM-011", productName: "Google Ads Setup", quantity: 1, price: 59.97 },
			],
		},
		{
			id: "ORD-006",
			createdAt: "2024-01-03T13:10:00Z",
			totalPrice: 89.99,
			status: "pending",
			items: [{ id: "ITEM-012", productName: "WhatsApp Business API", quantity: 1, price: 89.99 }],
		},
	];

	const filteredOrders = orders.filter((order) => {
		const matchesSearch =
			order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.items.some((item) => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));

		const matchesStatus = statusFilter === "all" || order.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const toggleOrderExpansion = (orderId: string) => {
		const newExpanded = new Set(expandedOrders);
		if (newExpanded.has(orderId)) {
			newExpanded.delete(orderId);
		} else {
			newExpanded.add(orderId);
		}
		setExpandedOrders(newExpanded);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "processing":
				return "bg-blue-100 text-blue-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Calculate summary statistics
	const totalOrders = orders.length;
	const completedOrders = orders.filter((o) => o.status === "completed").length;
	const totalSpent = orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.totalPrice, 0);
	const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;

	return (
		<div className="space-y-6">
			{/* Summary Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Total Orders</p>
								<p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
							</div>
							<ShoppingBag className="h-8 w-8 text-blue-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Completed</p>
								<p className="text-2xl font-bold text-green-600">{completedOrders}</p>
							</div>
							<Package className="h-8 w-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Total Spent</p>
								<p className="text-2xl font-bold text-purple-600">${totalSpent.toFixed(2)}</p>
							</div>
							<DollarSign className="h-8 w-8 text-purple-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Pending</p>
								<p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
							</div>
							<Calendar className="h-8 w-8 text-yellow-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Order History</CardTitle>
					<CardDescription>View and manage your order history</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 md:flex-row">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
								<Input
									placeholder="Search orders..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						<div className="flex gap-2">
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="processing">Processing</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
								</SelectContent>
							</Select>

							<Button variant="outline">
								<Download className="mr-2 h-4 w-4" />
								Export
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Orders List */}
			<div className="space-y-4">
				{filteredOrders.map((order, index) => (
					<motion.div
						key={order.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<Card>
							<Collapsible
								open={expandedOrders.has(order.id)}
								onOpenChange={() => toggleOrderExpansion(order.id)}
							>
								<CollapsibleTrigger asChild>
									<CardHeader className="cursor-pointer transition-colors hover:bg-gray-50">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-4">
												<div>
													<CardTitle className="text-lg">Order {order.id}</CardTitle>
													<CardDescription>
														{dayjs(order.createdAt).format("MMM dd, yyyy 'at' HH:mm")}
													</CardDescription>
												</div>
												<Badge className={getStatusColor(order.status)}>{order.status}</Badge>
											</div>

											<div className="flex items-center gap-4">
												<div className="text-right">
													<p className="text-lg font-semibold">
														${order.totalPrice.toFixed(2)}
													</p>
													<p className="text-sm text-gray-600">{order.items.length} items</p>
												</div>
												{expandedOrders.has(order.id) ? (
													<ChevronUp className="h-5 w-5 text-gray-400" />
												) : (
													<ChevronDown className="h-5 w-5 text-gray-400" />
												)}
											</div>
										</div>
									</CardHeader>
								</CollapsibleTrigger>

								<CollapsibleContent>
									<CardContent className="pt-0">
										<div className="border-t pt-4">
											<h4 className="mb-3 font-semibold">Order Items</h4>
											<div className="space-y-3">
												{order.items.map((item) => (
													<div
														key={item.id}
														className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
													>
														<div className="flex-1">
															<h5 className="font-medium text-gray-900">
																{item.productName}
															</h5>
															<p className="text-sm text-gray-600">
																Quantity: {item.quantity}
															</p>
														</div>
														<div className="text-right">
															<p className="font-semibold">${item.price.toFixed(2)}</p>
															{item.quantity > 1 && (
																<p className="text-sm text-gray-600">
																	${(item.price / item.quantity).toFixed(2)} each
																</p>
															)}
														</div>
													</div>
												))}
											</div>

											<div className="mt-4 flex items-center justify-between border-t pt-4">
												<div className="flex gap-2">
													<Button variant="outline" size="sm">
														<Eye className="mr-2 h-4 w-4" />
														View Details
													</Button>
													{order.status === "completed" && (
														<Button variant="outline" size="sm">
															Reorder
														</Button>
													)}
												</div>
												<div className="text-right">
													<p className="text-lg font-bold">
														Total: ${order.totalPrice.toFixed(2)}
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</CollapsibleContent>
							</Collapsible>
						</Card>
					</motion.div>
				))}
			</div>

			{filteredOrders.length === 0 && (
				<Card>
					<CardContent className="py-12 text-center">
						<Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
						<p className="text-gray-500">No orders found matching your criteria.</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
