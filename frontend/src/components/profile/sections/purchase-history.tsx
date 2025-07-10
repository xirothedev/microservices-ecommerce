"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Package, Eye, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

interface Purchase {
	id: string;
	orderNumber: string;
	productName: string;
	productImage: string;
	purchaseDate: string;
	deliveryDate?: string;
	amount: number;
	status: "delivered" | "processing" | "cancelled" | "refunded";
	category: string;
}

export default function PurchaseHistory() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");

	// Mock purchase data
	const purchases: Purchase[] = [
		{
			id: "ORD-001",
			orderNumber: "DP-2024-001",
			productName: "Apple ID Premium Setup",
			productImage:
				"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=60&width=60",
			purchaseDate: "2024-01-15",
			deliveryDate: "2024-01-15",
			amount: 49.99,
			status: "delivered",
			category: "Apple Services",
		},
		{
			id: "ORD-002",
			orderNumber: "DP-2024-002",
			productName: "Facebook Business Account Setup",
			productImage:
				"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=60&width=60",
			purchaseDate: "2024-01-10",
			deliveryDate: "2024-01-11",
			amount: 79.99,
			status: "delivered",
			category: "Social Media",
		},
		{
			id: "ORD-003",
			orderNumber: "DP-2024-003",
			productName: "YouTube Premium Family Plan",
			productImage:
				"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=60&width=60",
			purchaseDate: "2024-01-05",
			amount: 29.99,
			status: "processing",
			category: "Streaming",
		},
		{
			id: "ORD-004",
			orderNumber: "DP-2023-045",
			productName: "Instagram Growth Package",
			productImage:
				"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=60&width=60",
			purchaseDate: "2023-12-20",
			amount: 89.99,
			status: "cancelled",
			category: "Social Media",
		},
		{
			id: "ORD-005",
			orderNumber: "DP-2023-044",
			productName: "LinkedIn Business Profile",
			productImage:
				"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=60&width=60",
			purchaseDate: "2023-12-15",
			deliveryDate: "2023-12-16",
			amount: 69.99,
			status: "delivered",
			category: "Business",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "delivered":
				return "bg-green-100 text-green-800";
			case "processing":
				return "bg-blue-100 text-blue-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			case "refunded":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const filteredPurchases = purchases.filter((purchase) => {
		const matchesSearch =
			purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			purchase.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === "all" || purchase.status === statusFilter;
		const matchesCategory = categoryFilter === "all" || purchase.category === categoryFilter;

		return matchesSearch && matchesStatus && matchesCategory;
	});

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Purchase History</CardTitle>
					<CardDescription>Track your orders and service deliveries</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Filters */}
					<div className="mb-6 flex flex-col gap-4 md:flex-row">
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
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full md:w-40">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="delivered">Delivered</SelectItem>
								<SelectItem value="processing">Processing</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
								<SelectItem value="refunded">Refunded</SelectItem>
							</SelectContent>
						</Select>
						<Select value={categoryFilter} onValueChange={setCategoryFilter}>
							<SelectTrigger className="w-full md:w-40">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								<SelectItem value="Apple Services">Apple Services</SelectItem>
								<SelectItem value="Social Media">Social Media</SelectItem>
								<SelectItem value="Streaming">Streaming</SelectItem>
								<SelectItem value="Business">Business</SelectItem>
							</SelectContent>
						</Select>
						<Button variant="outline" className="flex items-center gap-2 bg-transparent">
							<Download className="h-4 w-4" />
							Export
						</Button>
					</div>

					{/* Purchase List */}
					<div className="space-y-4">
						{filteredPurchases.map((purchase, index) => (
							<motion.div
								key={purchase.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
							>
								<div className="flex flex-col gap-4 md:flex-row">
									{/* Product Image */}
									<div className="flex-shrink-0">
										<Image
											src={
												purchase.productImage ||
												"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
											}
											alt={purchase.productName}
											width={60}
											height={60}
											className="rounded-lg object-cover"
										/>
									</div>

									{/* Product Details */}
									<div className="flex-1">
										<div className="mb-2 flex items-start justify-between">
											<div>
												<h3 className="mb-1 font-semibold text-gray-900">
													{purchase.productName}
												</h3>
												<div className="mb-2 flex items-center gap-2">
													<Badge className={getStatusColor(purchase.status)}>
														{purchase.status}
													</Badge>
													<Badge variant="outline">{purchase.category}</Badge>
												</div>
											</div>
											<div className="text-right">
												<div className="text-lg font-semibold text-gray-900">
													${purchase.amount.toFixed(2)}
												</div>
											</div>
										</div>

										<div className="mb-3 flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center">
											<span>Order #{purchase.orderNumber}</span>
											<span className="hidden sm:inline">•</span>
											<span>
												Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}
											</span>
											{purchase.deliveryDate && (
												<>
													<span className="hidden sm:inline">•</span>
													<span>
														Delivered:{" "}
														{new Date(purchase.deliveryDate).toLocaleDateString()}
													</span>
												</>
											)}
										</div>

										{/* Action Buttons */}
										<div className="flex flex-wrap gap-2">
											<Button
												variant="outline"
												size="sm"
												className="flex items-center gap-2 bg-transparent"
											>
												<Eye className="h-4 w-4" />
												View Details
											</Button>
											{purchase.status === "delivered" && (
												<Button
													variant="outline"
													size="sm"
													className="flex items-center gap-2 bg-transparent"
												>
													<RotateCcw className="h-4 w-4" />
													Reorder
												</Button>
											)}
											{purchase.status === "processing" && (
												<Button
													variant="outline"
													size="sm"
													className="flex items-center gap-2 bg-transparent"
												>
													<Package className="h-4 w-4" />
													Track Order
												</Button>
											)}
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>

					{filteredPurchases.length === 0 && (
						<div className="py-8 text-center">
							<Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
							<p className="text-gray-500">No orders found matching your criteria.</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Order Summary */}
			<Card>
				<CardHeader>
					<CardTitle>Order Summary</CardTitle>
					<CardDescription>Overview of your purchase activity</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-4">
						<div className="rounded-lg bg-blue-50 p-4 text-center">
							<div className="text-2xl font-bold text-blue-600">{purchases.length}</div>
							<div className="text-sm text-gray-600">Total Orders</div>
						</div>
						<div className="rounded-lg bg-green-50 p-4 text-center">
							<div className="text-2xl font-bold text-green-600">
								{purchases.filter((p) => p.status === "delivered").length}
							</div>
							<div className="text-sm text-gray-600">Delivered</div>
						</div>
						<div className="rounded-lg bg-yellow-50 p-4 text-center">
							<div className="text-2xl font-bold text-yellow-600">
								{purchases.filter((p) => p.status === "processing").length}
							</div>
							<div className="text-sm text-gray-600">Processing</div>
						</div>
						<div className="rounded-lg bg-purple-50 p-4 text-center">
							<div className="text-2xl font-bold text-purple-600">
								${purchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
							</div>
							<div className="text-sm text-gray-600">Total Spent</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
