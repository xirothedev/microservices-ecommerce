"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Search,
	Download,
	ArrowUp,
	ArrowDown,
	CalendarIcon,
	CreditCard,
	TrendingUp,
	TrendingDown,
	DollarSign,
} from "lucide-react";
import { motion } from "motion/react";
import { format } from "date-fns";

interface PaymentTransaction {
	id: string;
	createdAt: string;
	transactionId: string;
	paymentMethod: string;
	type: "in" | "out";
	status: "completed" | "pending" | "failed" | "cancelled";
	amount: number;
	note: string;
}

type SortField = "createdAt" | "amount" | "status";
type SortOrder = "asc" | "desc";

export default function PaymentContent() {
	const [searchTerm, setSearchTerm] = useState("");
	const [typeFilter, setTypeFilter] = useState<"all" | "in" | "out">("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [methodFilter, setMethodFilter] = useState<string>("all");
	const [sortField, setSortField] = useState<SortField>("createdAt");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
	const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

	// Mock payment data
	const transactions: PaymentTransaction[] = [
		{
			id: "PAY-001",
			createdAt: "2024-01-15T10:30:00Z",
			transactionId: "TXN-ABC123",
			paymentMethod: "Visa **** 4242",
			type: "out",
			status: "completed",
			amount: 49.99,
			note: "Apple ID Premium Setup Service",
		},
		{
			id: "PAY-002",
			createdAt: "2024-01-14T15:45:00Z",
			transactionId: "TXN-DEF456",
			paymentMethod: "PayPal",
			type: "out",
			status: "completed",
			amount: 79.99,
			note: "Facebook Business Account Setup",
		},
		{
			id: "PAY-003",
			createdAt: "2024-01-12T09:15:00Z",
			transactionId: "TXN-GHI789",
			paymentMethod: "Mastercard **** 5555",
			type: "out",
			status: "pending",
			amount: 29.99,
			note: "YouTube Premium Family Plan",
		},
		{
			id: "PAY-004",
			createdAt: "2024-01-10T14:20:00Z",
			transactionId: "TXN-JKL012",
			paymentMethod: "Visa **** 4242",
			type: "in",
			status: "completed",
			amount: 25.0,
			note: "Refund for cancelled service",
		},
		{
			id: "PAY-005",
			createdAt: "2024-01-08T11:30:00Z",
			transactionId: "TXN-MNO345",
			paymentMethod: "Apple Pay",
			type: "out",
			status: "failed",
			amount: 89.99,
			note: "Instagram Growth Package",
		},
		{
			id: "PAY-006",
			createdAt: "2024-01-05T16:45:00Z",
			transactionId: "TXN-PQR678",
			paymentMethod: "Google Pay",
			type: "out",
			status: "completed",
			amount: 69.99,
			note: "LinkedIn Business Profile Setup",
		},
		{
			id: "PAY-007",
			createdAt: "2024-01-03T13:10:00Z",
			transactionId: "TXN-STU901",
			paymentMethod: "Visa **** 4242",
			type: "out",
			status: "cancelled",
			amount: 39.99,
			note: "TikTok Business Account - Cancelled",
		},
		{
			id: "PAY-008",
			createdAt: "2023-12-28T10:00:00Z",
			transactionId: "TXN-VWX234",
			paymentMethod: "PayPal",
			type: "in",
			status: "completed",
			amount: 15.5,
			note: "Partial refund for service modification",
		},
	];

	const filteredAndSortedTransactions = useMemo(() => {
		const filtered = transactions.filter((transaction) => {
			const matchesSearch =
				transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
				transaction.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
				transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesType = typeFilter === "all" || transaction.type === typeFilter;
			const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
			const matchesMethod = methodFilter === "all" || transaction.paymentMethod.includes(methodFilter);

			const transactionDate = new Date(transaction.createdAt);
			const matchesDateRange =
				(!dateRange.from || transactionDate >= dateRange.from) &&
				(!dateRange.to || transactionDate <= dateRange.to);

			return matchesSearch && matchesType && matchesStatus && matchesMethod && matchesDateRange;
		});

		// Sort transactions
		filtered.sort((a, b) => {
			let aValue: any = a[sortField];
			let bValue: any = b[sortField];

			if (sortField === "createdAt") {
				aValue = new Date(aValue).getTime();
				bValue = new Date(bValue).getTime();
			} else if (sortField === "amount") {
				aValue = Number(aValue);
				bValue = Number(bValue);
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		return filtered;
	}, [transactions, searchTerm, typeFilter, statusFilter, methodFilter, sortField, sortOrder, dateRange]);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortOrder("desc");
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "failed":
				return "bg-red-100 text-red-800";
			case "cancelled":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getTypeColor = (type: string) => {
		return type === "in" ? "text-green-600" : "text-red-600";
	};

	const getTypeIcon = (type: string) => {
		return type === "in" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
	};

	// Calculate summary statistics
	const totalIn = transactions
		.filter((t) => t.type === "in" && t.status === "completed")
		.reduce((sum, t) => sum + t.amount, 0);
	const totalOut = transactions
		.filter((t) => t.type === "out" && t.status === "completed")
		.reduce((sum, t) => sum + t.amount, 0);
	const pendingAmount = transactions.filter((t) => t.status === "pending").reduce((sum, t) => sum + t.amount, 0);

	return (
		<div className="space-y-6">
			{/* Summary Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Total Spent</p>
								<p className="text-2xl font-bold text-red-600">${totalOut.toFixed(2)}</p>
							</div>
							<TrendingDown className="h-8 w-8 text-red-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Total Received</p>
								<p className="text-2xl font-bold text-green-600">${totalIn.toFixed(2)}</p>
							</div>
							<TrendingUp className="h-8 w-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Pending</p>
								<p className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
							</div>
							<DollarSign className="h-8 w-8 text-yellow-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Transactions</p>
								<p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
							</div>
							<CreditCard className="h-8 w-8 text-blue-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card>
				<CardHeader>
					<CardTitle>Payment Transactions</CardTitle>
					<CardDescription>View and manage your payment history</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Search and Filters Row */}
						<div className="flex flex-col gap-4 lg:flex-row">
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

							<div className="flex flex-col gap-2 sm:flex-row">
								<Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
									<SelectTrigger className="w-full sm:w-32">
										<SelectValue placeholder="Type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Types</SelectItem>
										<SelectItem value="in">Income</SelectItem>
										<SelectItem value="out">Expense</SelectItem>
									</SelectContent>
								</Select>

								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-full sm:w-32">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
										<SelectItem value="pending">Pending</SelectItem>
										<SelectItem value="failed">Failed</SelectItem>
										<SelectItem value="cancelled">Cancelled</SelectItem>
									</SelectContent>
								</Select>

								<Popover>
									<PopoverTrigger asChild>
										<Button variant="outline" className="w-full bg-transparent sm:w-auto">
											<CalendarIcon className="mr-2 h-4 w-4" />
											Date Range
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="end">
										<Calendar
											mode="range"
											selected={{ from: dateRange.from, to: dateRange.to }}
											onSelect={(range) => setDateRange(range || {})}
											numberOfMonths={2}
										/>
									</PopoverContent>
								</Popover>

								<Button variant="outline" className="w-full bg-transparent sm:w-auto">
									<Download className="mr-2 h-4 w-4" />
									Export
								</Button>
							</div>
						</div>

						{/* Sort Controls */}
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleSort("createdAt")}
								className="flex items-center gap-1"
							>
								Date
								{sortField === "createdAt" &&
									(sortOrder === "asc" ? (
										<ArrowUp className="h-3 w-3" />
									) : (
										<ArrowDown className="h-3 w-3" />
									))}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleSort("amount")}
								className="flex items-center gap-1"
							>
								Amount
								{sortField === "amount" &&
									(sortOrder === "asc" ? (
										<ArrowUp className="h-3 w-3" />
									) : (
										<ArrowDown className="h-3 w-3" />
									))}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleSort("status")}
								className="flex items-center gap-1"
							>
								Status
								{sortField === "status" &&
									(sortOrder === "asc" ? (
										<ArrowUp className="h-3 w-3" />
									) : (
										<ArrowDown className="h-3 w-3" />
									))}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Transactions List */}
			<Card>
				<CardContent className="p-0">
					<div className="space-y-0">
						{filteredAndSortedTransactions.map((transaction, index) => (
							<motion.div
								key={transaction.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.05 }}
								className="border-b p-6 transition-colors last:border-b-0 hover:bg-gray-50"
							>
								<div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
									<div className="flex-1">
										<div className="mb-2 flex items-center gap-3">
											<div
												className={`flex items-center gap-1 ${getTypeColor(transaction.type)}`}
											>
												{getTypeIcon(transaction.type)}
												<span className="font-semibold">
													{transaction.type === "in" ? "+" : "-"}$
													{transaction.amount.toFixed(2)}
												</span>
											</div>
											<Badge className={getStatusColor(transaction.status)}>
												{transaction.status}
											</Badge>
										</div>

										<h3 className="mb-1 font-medium text-gray-900">{transaction.note}</h3>

										<div className="flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center">
											<span>ID: {transaction.transactionId}</span>
											<span className="hidden sm:inline">•</span>
											<span>{transaction.paymentMethod}</span>
											<span className="hidden sm:inline">•</span>
											<span>
												{format(new Date(transaction.createdAt), "MMM dd, yyyy 'at' HH:mm")}
											</span>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Button variant="outline" size="sm">
											View Details
										</Button>
									</div>
								</div>
							</motion.div>
						))}
					</div>

					{filteredAndSortedTransactions.length === 0 && (
						<div className="py-12 text-center">
							<CreditCard className="mx-auto mb-4 h-12 w-12 text-gray-400" />
							<p className="text-gray-500">No transactions found matching your criteria.</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
