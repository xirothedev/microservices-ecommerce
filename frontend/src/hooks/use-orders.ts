import { useToast } from "@/hooks/use-toast";
import { ordersApi } from "@/lib/api/orders";
import {
	ApiError,
	CreateOrderFromCartRequest,
	CreateOrderRequest,
	FindAllOrdersRequest,
	Order,
	OrderItem,
	OrdersListResponse,
} from "@/lib/api/types/orders";
import { useCallback, useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

const PAGE_SIZE = 20;

// Hook for fetching user orders
export function useUserOrders(params?: FindAllOrdersRequest) {
	const { toast } = useToast();

	const { data, isLoading, isError, error, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery<
		OrdersListResponse,
		ApiError
	>({
		queryKey: ["user-orders", params?.search, params?.status, params?.limit],
		queryFn: async ({ pageParam }) => {
			const queryParams: FindAllOrdersRequest = { ...params, limit: PAGE_SIZE };
			if (pageParam) queryParams.cursor = pageParam as string;
			return await ordersApi.getUserOrders(queryParams);
		},
		getNextPageParam: (lastPage) => lastPage?.["@data"]?.nextCursor || null,
		initialPageParam: undefined,
	});

	const orders: Order[] = (data?.pages || []).flatMap((page) => page.data || []);

	const loadMore = useCallback(() => {
		if (hasNextPage && !isLoading) {
			fetchNextPage();
		}
	}, [hasNextPage, isLoading, fetchNextPage]);

	const refresh = useCallback(() => {
		refetch();
	}, [refetch]);

	// Show toast on error
	useEffect(() => {
		if (isError && error) {
			toast({
				title: "Failed to fetch orders",
				description: error.message || "Failed to fetch orders",
				variant: "destructive",
			});
		}
	}, [isError, error, toast]);

	return {
		orders,
		loading: isLoading,
		error: isError ? error?.message || "Failed to fetch orders" : null,
		totalItems: data?.pages?.[0]?.["@data"]?.totalItems || 0,
		hasNextPage: !!hasNextPage,
		loadMore,
		refresh,
	};
}

// Hook for fetching seller orders
export function useSellerOrders(params?: FindAllOrdersRequest) {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [totalItems, setTotalItems] = useState(0);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [hasNextPage, setHasNextPage] = useState(false);
	const { toast } = useToast();

	const fetchOrders = useCallback(
		async (resetData = false) => {
			try {
				setLoading(true);
				setError(null);

				const response = await ordersApi.getSellerOrders(params);

				if (resetData) {
					setOrders(response.data);
				} else {
					setOrders((prev) => [...prev, ...response.data]);
				}

				setTotalItems(response["@data"]?.totalItems || 0);
				setNextCursor(response["@data"]?.nextCursor || null);
				setHasNextPage(response["@data"]?.hasNextPage || false);
			} catch (err) {
				const error = err as ApiError;
				setError(error.message || "Failed to fetch seller orders");
				toast({
					title: "Failed to fetch seller orders",
					description: error.message || "Failed to fetch seller orders",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		},
		[params],
	);

	const loadMore = useCallback(() => {
		if (hasNextPage && nextCursor && !loading) {
			fetchOrders(false);
		}
	}, [hasNextPage, nextCursor, loading, fetchOrders]);

	const refresh = useCallback(() => {
		fetchOrders(true);
	}, [fetchOrders]);

	useEffect(() => {
		fetchOrders(true);
	}, [fetchOrders]);

	return {
		orders,
		loading,
		error,
		totalItems,
		hasNextPage,
		loadMore,
		refresh,
	};
}

// Hook for fetching single order
export function useOrder(orderId: string | null) {
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { toast } = useToast();

	const fetchOrder = useCallback(async () => {
		if (!orderId) return;

		try {
			setLoading(true);
			setError(null);

			const response = await ordersApi.getOrderById(orderId);
			setOrder(response.data);
		} catch (err) {
			const error = err as ApiError;
			setError(error.message || "Failed to fetch order");
			toast({
				title: "Failed to fetch order details",
				description: error.message || "Failed to fetch order details",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	}, [orderId]);

	useEffect(() => {
		fetchOrder();
	}, [fetchOrder]);

	return {
		order,
		loading,
		error,
		refresh: fetchOrder,
	};
}

// Hook for fetching order items
export function useOrderItems(orderId: string | null) {
	const [items, setItems] = useState<OrderItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { toast } = useToast();

	const fetchItems = useCallback(async () => {
		if (!orderId) return;

		try {
			setLoading(true);
			setError(null);

			const response = await ordersApi.getOrderItems(orderId);
			setItems(response.data);
		} catch (err) {
			const error = err as ApiError;
			setError(error.message || "Failed to fetch order items");
			toast({
				title: "Failed to fetch order items",
				description: error.message || "Failed to fetch order items",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	}, [orderId]);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	return {
		items,
		loading,
		error,
		refresh: fetchItems,
	};
}

// Hook for order mutations (create, cancel, refund)
export function useOrderMutations() {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const createOrder = useCallback(async (data: CreateOrderRequest): Promise<Order | null> => {
		try {
			setLoading(true);
			const response = await ordersApi.createOrder(data);
			toast({
				title: "Order created successfully",
				description: "Order created successfully",
			});
			return response.data;
		} catch (err) {
			const error = err as ApiError;
			toast({
				title: "Failed to create order",
				description: error.message || "Failed to create order",
				variant: "destructive",
			});
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	const createOrderFromCart = useCallback(async (data: CreateOrderFromCartRequest): Promise<Order | null> => {
		try {
			setLoading(true);
			const response = await ordersApi.createOrderFromCart(data);
			toast({
				title: "Order created from cart successfully",
				description: "Order created from cart successfully",
			});
			return response.data;
		} catch (err) {
			const error = err as ApiError;
			toast({
				title: "Failed to create order from cart",
				description: error.message || "Failed to create order from cart",
				variant: "destructive",
			});
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	const cancelOrder = useCallback(async (orderId: string): Promise<boolean> => {
		try {
			setLoading(true);
			await ordersApi.cancelOrder(orderId);
			toast({
				title: "Order cancelled successfully",
				description: "Order cancelled successfully",
			});
			return true;
		} catch (err) {
			const error = err as ApiError;
			toast({
				title: "Failed to cancel order",
				description: error.message || "Failed to cancel order",
				variant: "destructive",
			});
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	const refundOrder = useCallback(async (orderId: string): Promise<boolean> => {
		try {
			setLoading(true);
			await ordersApi.refundOrder(orderId);
			toast({
				title: "Order refunded successfully",
				description: "Order refunded successfully",
			});
			return true;
		} catch (err) {
			const error = err as ApiError;
			toast({
				title: "Failed to refund order",
				description: error.message || "Failed to refund order",
				variant: "destructive",
			});
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		loading,
		createOrder,
		createOrderFromCart,
		cancelOrder,
		refundOrder,
	};
}
