import axiosInstance from "@/lib/axios";
import {
	CreateOrderRequest,
	CreateOrderFromCartRequest,
	FindAllOrdersRequest,
	OrdersListResponse,
	OrderResponse,
	OrderItemsResponse,
	CreateOrderResponse,
	ApiResponse,
} from "./types/orders";

class OrdersApi {
	/**
	 * Create a new order
	 */
	async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
		const response = await axiosInstance.post<CreateOrderResponse>("/orders", data);
		return response.data;
	}

	/**
	 * Create order from cart
	 */
	async createOrderFromCart(data: CreateOrderFromCartRequest): Promise<CreateOrderResponse> {
		const response = await axiosInstance.post<CreateOrderResponse>(`/orders/from-cart`, data);
		return response.data;
	}

	/**
	 * Get user orders (for users to see their own orders)
	 */
	async getUserOrders(params?: FindAllOrdersRequest): Promise<OrdersListResponse> {
		const response = await axiosInstance.get<OrdersListResponse>(`/orders`, { params });
		return response.data;
	}

	/**
	 * Get seller orders (for sellers to see orders of their products)
	 */
	async getSellerOrders(params?: FindAllOrdersRequest): Promise<OrdersListResponse> {
		const response = await axiosInstance.get<OrdersListResponse>(`/orders/seller`, { params });
		return response.data;
	}

	/**
	 * Get order by ID
	 */
	async getOrderById(orderId: string): Promise<OrderResponse> {
		const response = await axiosInstance.get<OrderResponse>(`/orders/${orderId}`);
		return response.data;
	}

	/**
	 * Get order items details
	 */
	async getOrderItems(orderId: string): Promise<OrderItemsResponse> {
		const response = await axiosInstance.get<OrderItemsResponse>(`/orders/${orderId}/items`);
		return response.data;
	}

	/**
	 * Cancel an order
	 */
	async cancelOrder(orderId: string): Promise<ApiResponse<null>> {
		const response = await axiosInstance.patch<ApiResponse<null>>(`/orders/${orderId}/cancel`);
		return response.data;
	}

	/**
	 * Refund an order (seller/admin only)
	 */
	async refundOrder(orderId: string): Promise<ApiResponse<null>> {
		const response = await axiosInstance.patch<ApiResponse<null>>(`/orders/${orderId}/refund`);
		return response.data;
	}

	/**
	 * Download order invoice as PDF
	 */
	async downloadInvoice(orderId: string): Promise<void> {
		const response = await axiosInstance.get(`/orders/${orderId}/invoice`, {
			responseType: "blob",
		});

		// Create download link
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `invoice-${orderId}.pdf`);
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(url);
	}
}

// Export singleton instance
export const ordersApi = new OrdersApi();

// Export individual methods for convenience
export const {
	createOrder,
	createOrderFromCart,
	getUserOrders,
	getSellerOrders,
	getOrderById,
	getOrderItems,
	cancelOrder,
	refundOrder,
	downloadInvoice,
} = ordersApi;
