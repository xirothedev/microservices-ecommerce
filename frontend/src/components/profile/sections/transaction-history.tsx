"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Eye } from "lucide-react";
import { motion } from "motion/react";

interface Transaction {
	id: string;
	date: string;
	description: string;
	amount: number;
	status: "completed" | "pending" | "failed";
	type: "payment" | "refund" | "subscription";
	method: string;
}

export default function TransactionHistory() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");

	// Mock transaction data
	const transactions: Transaction[] = [
		{
			id: "TXN-001",
			date: "2024-01-15",
			description: "Apple ID Premium Setup",
			amount: 49.99,
			status: "completed",
			type: "payment",
			method: "Credit Card",
		},
		{
			id: "TXN-002",
			date: "2024-01-10",
			description: "Facebook Business Account",
			amount: 79.99,
			status: "completed",
			type: "payment",
			method: "PayPal",
		},
		{
			id: "TXN-003",
			date: "2024-01-05",
			description: "YouTube Premium Family",
			amount: 29.99,
			status: "pending",
			type: "subscription",
			method: "Credit Card",
		},
		{
			id: "TXN-004",
			date: "2023-12-28",
			description: "Service Refund",
			amount: -25.0,
			status: "completed",
			type: "refund",
			method: "Credit Card",
		},
		{
			id: "TXN-005",
			date: "2023-12-20",
			description: "Instagram Growth Package",
			amount: 89.99,
			status: "failed",
			type: "payment",
			method: "Credit Card",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "failed":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case "payment":
				return "bg-blue-100 text-blue-800";
			case "refund":
				return "bg-purple-100 text-purple-800";
			case "subscription":
				return "bg-orange-100 text-orange-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const filteredTransactions = transactions.filter((transaction) => {
		const matchesSearch =
			transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
		const matchesType = typeFilter === "all" || transaction.type === typeFilter;

		return matchesSearch && matchesStatus && matchesType;
	});

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Transaction History</CardTitle>
					<CardDescription>View and manage your payment transactions</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Filters */}
					<div className="mb-6 flex flex-col gap-4 md:flex-row">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
								<Input
									placeholder="Search transactions..."
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
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="failed">Failed</SelectItem>
							</SelectContent>
						</Select>
						<Select value={typeFilter} onValueChange={setTypeFilter}>
							<SelectTrigger className="w-full md:w-40">
								<SelectValue placeholder="Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="payment">Payment</SelectItem>
								<SelectItem value="refund">Refund</SelectItem>
								<SelectItem value="subscription">Subscription</SelectItem>
							</SelectContent>
						</Select>
						<Button variant="outline" className="flex items-center gap-2 bg-transparent">
							<Download className="h-4 w-4" />
							Export
						</Button>
					</div>

					{/* Transaction List */}
					<div className="space-y-4">
						{filteredTransactions.map((transaction, index) => (
							<motion.div
								key={transaction.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
							>
								<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
									<div className="flex-1">
										<div className="mb-2 flex items-center gap-3">
											<h3 className="font-semibold text-gray-900">{transaction.description}</h3>
											<Badge className={getStatusColor(transaction.status)}>
												{transaction.status}
											</Badge>
											<Badge variant="outline" className={getTypeColor(transaction.type)}>
												{transaction.type}
											</Badge>
										</div>
										<div className="flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center">
											<span>Transaction ID: {transaction.id}</span>
											<span className="hidden sm:inline">•</span>
											<span>{new Date(transaction.date).toLocaleDateString()}</span>
											<span className="hidden sm:inline">•</span>
											<span>Paid via {transaction.method}</span>
										</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="text-right">
											<div
												className={`text-lg font-semibold ${
													transaction.amount < 0 ? "text-green-600" : "text-gray-900"
												}`}
											>
												{transaction.amount < 0 ? "+" : ""}$
												{Math.abs(transaction.amount).toFixed(2)}
											</div>
										</div>
										<Button
											variant="outline"
											size="sm"
											className="flex items-center gap-2 bg-transparent"
										>
											<Eye className="h-4 w-4" />
											View
										</Button>
									</div>
								</div>
							</motion.div>
						))}
					</div>

					{filteredTransactions.length === 0 && (
						<div className="py-8 text-center">
							<p className="text-gray-500">No transactions found matching your criteria.</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Summary Card */}
			<Card>
				<CardHeader>
					<CardTitle>Transaction Summary</CardTitle>
					<CardDescription>Overview of your transaction activity</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-4">
						<div className="rounded-lg bg-blue-50 p-4 text-center">
							<div className="text-2xl font-bold text-blue-600">
								$
								{transactions
									.filter((t) => t.amount > 0)
									.reduce((sum, t) => sum + t.amount, 0)
									.toFixed(2)}
							</div>
							<div className="text-sm text-gray-600">Total Spent</div>
						</div>
						<div className="rounded-lg bg-green-50 p-4 text-center">
							<div className="text-2xl font-bold text-green-600">
								{transactions.filter((t) => t.status === "completed").length}
							</div>
							<div className="text-sm text-gray-600">Completed</div>
						</div>
						<div className="rounded-lg bg-yellow-50 p-4 text-center">
							<div className="text-2xl font-bold text-yellow-600">
								{transactions.filter((t) => t.status === "pending").length}
							</div>
							<div className="text-sm text-gray-600">Pending</div>
						</div>
						<div className="rounded-lg bg-purple-50 p-4 text-center">
							<div className="text-2xl font-bold text-purple-600">
								$
								{Math.abs(
									transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0),
								).toFixed(2)}
							</div>
							<div className="text-sm text-gray-600">Refunded</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
