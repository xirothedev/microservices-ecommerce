"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useOrder, useOrderMutations } from "@/lib/api/orders";
import dayjs from "dayjs";
import { CreditCard, Loader2, Package, RefreshCw, User, X } from "lucide-react";

interface OrderDetailsModalProps {
	orderId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onOrderUpdated?: () => void;
}

// Status mapping for display
const statusConfig = {
	PENDING: { label: "Pending", color: "bg-yellow-500", icon: RefreshCw },
	DONE: { label: "Completed", color: "bg-green-500", icon: Package },
	CANCELLED: { label: "Cancelled", color: "bg-red-500", icon: X },
	REFUNDED: { label: "Refunded", color: "bg-blue-500", icon: RefreshCw },
	FAILED: { label: "Failed", color: "bg-red-600", icon: X },
} as const;

export function OrderDetailsModal({ orderId, open, onOpenChange, onOrderUpdated }: OrderDetailsModalProps) {
	const { order, loading, error } = useOrder(orderId);
	const { cancelOrder, refundOrder, loading: mutationLoading } = useOrderMutations();

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(price);
	};

	const getStatusBadge = (status: string) => {
		const config = statusConfig[status as keyof typeof statusConfig];
		if (!config) return null;

		const Icon = config.icon;
		return (
			<Badge variant="secondary" className={`${config.color} text-white`}>
				<Icon className="mr-1 h-3 w-3" />
				{config.label}
			</Badge>
		);
	};

	const handleCancelOrder = async () => {
		if (!order) return;

		const success = await cancelOrder(order.id);
		if (success) {
			onOrderUpdated?.();
		}
	};

	const handleRefundOrder = async () => {
		if (!order) return;

		const success = await refundOrder(order.id);
		if (success) {
			onOrderUpdated?.();
		}
	};

	if (loading) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[600px]">
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (error || !order) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[600px]">
					<div className="py-12 text-center">
						<X className="mx-auto mb-4 h-12 w-12 text-red-500" />
						<h3 className="mb-2 text-lg font-semibold text-red-700">Error Loading Order</h3>
						<p className="text-gray-600">{error || "Order not found"}</p>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false} className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between gap-5">
						<span title={order.id} className="max-w-80 truncate">
							Order #{order.id}
						</span>
						{getStatusBadge(order.bill?.status || "PENDING")}
					</DialogTitle>
					<DialogDescription>
						Order placed on {dayjs(order.createdAt).format("MMMM DD, YYYY [at] HH:mm")}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Order Summary */}
					<div className="rounded-lg border p-4">
						<h3 className="mb-3 flex items-center gap-2 font-semibold">
							<Package className="h-4 w-4" />
							Order Summary
						</h3>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-gray-600">Order ID:</span>
								<span className="ml-2 font-medium">{order.id}</span>
							</div>
							<div>
								<span className="text-gray-600">Total Amount:</span>
								<span className="ml-2 font-semibold text-green-600">
									{formatPrice(order.totalPrice)}
								</span>
							</div>
							<div>
								<span className="text-gray-600">Order Date:</span>
								<span className="ml-2">{dayjs(order.createdAt).format("MMM DD, YYYY")}</span>
							</div>
							<div>
								<span className="text-gray-600">Status:</span>
								<span className="ml-2">{order.bill?.status || "PENDING"}</span>
							</div>
						</div>
					</div>

					{/* Customer Information */}
					{order.user && (
						<div className="rounded-lg border p-4">
							<h3 className="mb-3 flex items-center gap-2 font-semibold">
								<User className="h-4 w-4" />
								Customer Information
							</h3>
							<div className="grid grid-cols-1 gap-2 text-sm">
								<div>
									<span className="text-gray-600">Name:</span>
									<span className="ml-2 font-medium">{order.user.fullname}</span>
								</div>
								<div>
									<span className="text-gray-600">Email:</span>
									<span className="ml-2">{order.user.email}</span>
								</div>
							</div>
						</div>
					)}

					{/* Order Items */}
					<div className="rounded-lg border p-4">
						<h3 className="mb-3 flex items-center gap-2 font-semibold">
							<Package className="h-4 w-4" />
							Order Items ({order.items.length})
						</h3>
						<div className="space-y-3">
							{order.items.map((item) => (
								<div
									key={item.id}
									className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
								>
									<div className="flex-1">
										<p className="font-medium">{item.product?.name || "Product"}</p>
										<p className="text-sm text-gray-600">
											Quantity: {item.quantity} | From: {item.from}
										</p>
										{item.product?.seller && (
											<p className="text-sm text-gray-500">
												Seller: {item.product.seller.fullname}
											</p>
										)}
									</div>
									<div className="text-right">
										<p className="font-semibold">{formatPrice(item.price)}</p>
										<p className="text-sm text-gray-600">
											{formatPrice(item.price / item.quantity)} each
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Payment Information */}
					{order.bill && (
						<div className="rounded-lg border p-4">
							<h3 className="mb-3 flex items-center gap-2 font-semibold">
								<CreditCard className="h-4 w-4" />
								Payment Information
							</h3>
							<div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
								<div>
									<span className="text-gray-600">Payment Method:</span>
									<span className="ml-2 font-medium">{order.bill.paymentMethod}</span>
								</div>
								<div>
									<span className="text-gray-600">Transaction ID:</span>
									<span className="ml-2 font-medium">{order.bill.transactionId || "N/A"}</span>
								</div>
								<div>
									<span className="text-gray-600">Amount:</span>
									<span className="ml-2 font-semibold">{formatPrice(order.bill.amount)}</span>
								</div>
								<div>
									<span className="text-gray-600">Payment Status:</span>
									<span className="ml-2">{order.bill.status}</span>
								</div>
								{order.bill.note && (
									<div className="sm:col-span-2">
										<span className="text-gray-600">Note:</span>
										<span className="ml-2">{order.bill.note}</span>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Actions */}
					<div className="flex gap-2 border-t pt-4">
						{order.bill?.status === "PENDING" && (
							<Button variant="destructive" onClick={handleCancelOrder} disabled={mutationLoading}>
								{mutationLoading ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<X className="mr-2 h-4 w-4" />
								)}
								Cancel Order
							</Button>
						)}
						{order.bill?.status === "DONE" && (
							<Button variant="outline" onClick={handleRefundOrder} disabled={mutationLoading}>
								{mutationLoading ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<RefreshCw className="mr-2 h-4 w-4" />
								)}
								Request Refund
							</Button>
						)}
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Close
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
