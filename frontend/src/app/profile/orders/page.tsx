"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useOrderMutations } from "@/lib/api/orders";
import { ordersApi, downloadInvoice } from "@/lib/api/orders";
import { FindAllOrdersRequest, Order, OrdersListResponse } from "@/lib/api/types/orders";
import { IAxiosError } from "@/typings";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
	AlertCircle,
	Calendar,
	ChevronDown,
	DollarSign,
	Download,
	Eye,
	Loader2,
	Package,
	RefreshCw,
	Search,
	ShoppingBag,
	X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { OrderDetailsModal } from "../components/orders/order-details-modal";
import { OrderStatusBadge } from "../components/orders/order-status-badge";

const PAGE_SIZE = 10;

export default function OrdersContent() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
	const [downloadingInvoices, setDownloadingInvoices] = useState<Set<string>>(new Set());

	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const { cancelOrder, loading: mutationLoading } = useOrderMutations();

	const { data, isLoading, isError, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery<
		OrdersListResponse,
		IAxiosError
	>({
		queryKey: ["orders", debouncedSearchTerm, statusFilter],
		queryFn: async ({ pageParam }) => {
			const params: FindAllOrdersRequest = { limit: PAGE_SIZE };
			if (pageParam) params.cursor = pageParam as string;
			if (debouncedSearchTerm) params.search = debouncedSearchTerm;
			if (statusFilter !== "all") params.status = statusFilter as any;
			return await ordersApi.getUserOrders(params);
		},
		getNextPageParam: (lastPage) => lastPage?.["@data"]?.nextCursor || null,
		initialPageParam: undefined,
	});

	const orders: Order[] = (data?.pages || []).flatMap((page) => page.data || []);

	const handleCancelOrder = useCallback(
		async (orderId: string) => {
			const success = await cancelOrder(orderId);
			if (success) {
				refetch();
			}
		},
		[cancelOrder, refetch],
	);

	const handleViewDetails = useCallback((orderId: string) => {
		setSelectedOrderId(orderId);
		setModalOpen(true);
	}, []);

	const handleModalClose = useCallback(() => {
		setModalOpen(false);
		setSelectedOrderId(null);
	}, []);

	const handleOrderUpdated = useCallback(() => {
		refetch();
	}, [refetch]);

	const toggleOrderExpanded = useCallback((orderId: string) => {
		setExpandedOrders((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(orderId)) {
				newSet.delete(orderId);
			} else {
				newSet.add(orderId);
			}
			return newSet;
		});
	}, []);

	const handleDownloadInvoice = useCallback(async (orderId: string) => {
		try {
			setDownloadingInvoices((prev) => new Set(prev).add(orderId));
			await downloadInvoice(orderId);
		} catch (error) {
			console.error("Failed to download invoice:", error);
			// TODO: Show error toast notification
		} finally {
			setDownloadingInvoices((prev) => {
				const newSet = new Set(prev);
				newSet.delete(orderId);
				return newSet;
			});
		}
	}, []);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(price);
	};

	if (isError) {
		return (
			<div className="container mx-auto p-6">
				<div className="py-12 text-center">
					<AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
					<h3 className="mb-2 text-lg font-semibold text-red-700">Error Loading Orders</h3>
					<p className="mb-4 text-gray-600">Failed to load orders</p>
					<Button onClick={() => refetch()} variant="outline">
						<RefreshCw className="mr-2 h-4 w-4" />
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto space-y-6 p-6">
			{/* Header */}
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
					<p className="mt-1 text-gray-600">Track and manage your orders</p>
				</div>
				<Button onClick={() => refetch()} variant="outline" disabled={isLoading}>
					<RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
					Refresh
				</Button>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Search className="h-5 w-5" />
						Search & Filter Orders
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="flex-1">
							<Input
								placeholder="Search by product name..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full sm:w-48">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								{[
									{ value: "all", label: "All Orders" },
									{ value: "PENDING", label: "Pending" },
									{ value: "DONE", label: "Completed" },
									{ value: "CANCELLED", label: "Cancelled" },
									{ value: "REFUNDED", label: "Refunded" },
									{ value: "FAILED", label: "Failed" },
								].map((option) => (
									<SelectItem className="cursor-pointer" key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Orders List */}
			<div className="space-y-4">
				{isLoading && orders.length === 0 ? (
					// Loading skeletons
					Array.from({ length: 3 }).map((_, index) => (
						<Card key={index}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-3 w-32" />
									</div>
									<Skeleton className="h-6 w-20" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-6 w-24" />
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<InfiniteScroll
						dataLength={orders.length}
						next={fetchNextPage}
						hasMore={!!hasNextPage}
						loader={<OrderLoading />}
						endMessage={<OrderEnded />}
						scrollThreshold={0.8}
					>
						{orders.length === 0 ? (
							<Card>
								<CardContent className="py-12 text-center">
									<ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
									<h3 className="mb-2 text-lg font-semibold text-gray-700">No Orders Found</h3>
									<p className="text-gray-500">
										{debouncedSearchTerm || statusFilter !== "all"
											? "Try adjusting your search or filter criteria"
											: "You haven't placed any orders yet"}
									</p>
								</CardContent>
							</Card>
						) : (
							orders.map((order) => (
								<motion.div
									key={order.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									<Card className="mt-2 transition-shadow hover:shadow-md">
										<Collapsible
											open={expandedOrders.has(order.id)}
											onOpenChange={() => toggleOrderExpanded(order.id)}
										>
											<CollapsibleTrigger asChild>
												<CardHeader className="cursor-pointer transition-colors hover:bg-gray-50">
													<div className="flex items-start justify-between">
														<div className="space-y-2">
															<div className="flex items-center gap-3">
																<CardTitle className="text-lg break-all">
																	Order #{order.id}
																</CardTitle>
																<OrderStatusBadge
																	status={order.bill?.status || "PENDING"}
																/>
															</div>
															<CardDescription className="flex items-center gap-2">
																<Calendar className="h-4 w-4" />
																{dayjs(order.createAt).format(
																	"MMM DD, YYYY [at] HH:mm",
																)}
															</CardDescription>
														</div>
														<div className="flex items-center gap-3 text-right">
															<div className="text-lg font-semibold text-green-600">
																{formatPrice(order.totalPrice)}
															</div>
															<motion.div
																animate={{
																	rotate: expandedOrders.has(order.id) ? 180 : 0,
																}}
																transition={{ duration: 0.2 }}
															>
																<ChevronDown className="h-5 w-5 text-gray-400" />
															</motion.div>
														</div>
													</div>
												</CardHeader>
											</CollapsibleTrigger>

											<CollapsibleContent asChild>
												<motion.div
													initial={false}
													animate={{
														height: expandedOrders.has(order.id) ? "auto" : 0,
														opacity: expandedOrders.has(order.id) ? 1 : 0,
													}}
													transition={{
														duration: 0.3,
														ease: "easeInOut",
													}}
													style={{ overflow: "hidden" }}
												>
													<CardContent className="pt-0">
														<div className="space-y-4">
															{/* Order Items */}
															<div>
																<h4 className="mb-3 flex items-center gap-2 font-semibold">
																	<Package className="h-4 w-4" />
																	Order Items ({order.items.length})
																</h4>
																<div className="space-y-2">
																	{order.items.map((item) => (
																		<div
																			key={item.id}
																			className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
																		>
																			<div className="flex-1">
																				<p className="font-medium">
																					{item.product?.name || "Product"}
																				</p>
																				<p className="text-sm text-gray-600">
																					Quantity: {item.quantity} | From:{" "}
																					{item.from}
																				</p>
																			</div>
																			<div className="text-right">
																				<p className="font-semibold">
																					{formatPrice(item.price)}
																				</p>
																			</div>
																		</div>
																	))}
																</div>
															</div>

															{/* Payment Info */}
															<div className="border-t pt-4">
																<h4 className="mb-3 flex items-center gap-2 font-semibold">
																	<DollarSign className="h-4 w-4" />
																	Payment Information
																</h4>
																<div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
																	<div>
																		<span className="text-gray-600">
																			Payment Method:
																		</span>
																		<span className="ml-2 font-medium">
																			{order.bill?.paymentMethod}
																		</span>
																	</div>
																	<div>
																		<span className="text-gray-600">
																			Transaction ID:
																		</span>
																		<span className="ml-2 font-medium">
																			{order.bill?.transactionId || "N/A"}
																		</span>
																	</div>
																	{order.bill?.note && (
																		<div className="sm:col-span-2">
																			<span className="text-gray-600">Note:</span>
																			<span className="ml-2">
																				{order.bill.note}
																			</span>
																		</div>
																	)}
																</div>
															</div>

															{/* Actions */}
															<div className="flex gap-2 border-t pt-4">
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => handleViewDetails(order.id)}
																>
																	<Eye className="mr-2 h-4 w-4" />
																	View Details
																</Button>
																{order.bill?.status === "DONE" && (
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() => handleDownloadInvoice(order.id)}
																		disabled={downloadingInvoices.has(order.id)}
																	>
																		{downloadingInvoices.has(order.id) ? (
																			<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																		) : (
																			<Download className="mr-2 h-4 w-4" />
																		)}
																		{downloadingInvoices.has(order.id)
																			? "Downloading..."
																			: "Download Invoice"}
																	</Button>
																)}
																{order.bill?.status === "PENDING" && (
																	<Button
																		variant="destructive"
																		size="sm"
																		onClick={() => handleCancelOrder(order.id)}
																		disabled={mutationLoading}
																	>
																		<X className="mr-2 h-4 w-4" />
																		Cancel Order
																	</Button>
																)}
															</div>
														</div>
													</CardContent>
												</motion.div>
											</CollapsibleContent>
										</Collapsible>
									</Card>
								</motion.div>
							))
						)}
					</InfiniteScroll>
				)}
			</div>

			{/* Order Details Modal */}
			<OrderDetailsModal
				orderId={selectedOrderId}
				open={modalOpen}
				onOpenChange={handleModalClose}
				onOrderUpdated={handleOrderUpdated}
			/>
		</div>
	);
}

function OrderLoading() {
	return (
		<div className="flex items-center justify-center py-4">
			<div className="flex items-center gap-2">
				<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
				<span className="text-sm text-gray-500">Loading more orders...</span>
			</div>
		</div>
	);
}

function OrderEnded() {
	return (
		<div className="py-4 text-center text-gray-500">
			<p className="text-sm">No more orders to load</p>
		</div>
	);
}
