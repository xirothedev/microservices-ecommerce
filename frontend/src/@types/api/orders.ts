import { Category, ProductItem } from "../backend";

// Order related types
export interface OrderItem {
	id: string;
	productId: string;
	productItemId: string;
	quantity: number;
	price: number;
	from: "CART" | "SERVICES";
	product?: {
		id: string;
		name: string;
		medias: string[];
		discountPrice: number;
		seller?: {
			id: string;
			fullname: string;
		};
	};
	productItem?: {
		id: string;
		isSold: boolean;
	};
}

export interface Bill {
	id: string;
	createdAt: string;
	updatedAt: string;
	transactionId?: string;
	paymentMethod: "MOMO" | "VIETQR_PAYOS";
	type: "MONEY_OUT" | "MONEY_IN";
	status: "DONE" | "PENDING" | "REFUNDED" | "CANCELLED" | "FAILED";
	amount: number;
	note: string;
}

export interface Order {
	id: string;
	createdAt: string;
	updatedAt: string;
	totalPrice: number;
	userId: string;
	billId: string;
	bill: Bill;
	items: OrderItem[];
	user: {
		id: string;
		fullname: string;
		email: string;
	};
}

// Request types
export interface CreateOrderItemRequest {
	productId: string;
	productItemId: string;
	quantity: number;
	from: "CART" | "SERVICES";
}

export interface CreateOrderRequest {
	items: CreateOrderItemRequest[];
	paymentMethod: "MOMO" | "VIETQR_PAYOS";
	note?: string;
	from?: "CART" | "SERVICES";
}

export interface CreateOrderFromCartRequest {
	paymentMethod: "MOMO" | "VIETQR_PAYOS";
	note?: string;
}

export interface FindAllOrdersRequest {
	page?: number;
	limit?: number;
	cursor?: string;
	status?: "DONE" | "PENDING" | "REFUNDED" | "CANCELLED" | "FAILED";
	search?: string;
	startDate?: string;
	endDate?: string;
	sellerId?: string;
}

// Response types
export interface ApiResponse<T> {
	message: string;
	data: T;
	"@data"?: {
		totalItems?: number;
		nextCursor?: string | null;
		hasNextPage?: boolean;
	};
}

export interface OrderData extends Omit<Order, "items"> {
	items: {
		product: {
			seller: {
				id: string;
				fullname: string;
			};
		};
		productItem: ProductItem;
	};
}

export interface OrderListData extends Omit<Order, "items"> {
	product: {
		id: string;
		name: string;
		medias: string[];
		discountPrice: number;
	};
	items: {
		id: string;
		from: "CART" | "SERVICES";
		quantity: number;
		price: number;
		productId: string;
		productItemId: string;
		orderId: string;
		product: {
			id: string;
			name: string;
			medias: string[];
			discountPrice: number;
		};
	}[];
}

export interface OrdersListResponse extends ApiResponse<OrderListData[]> {
	"@data": {
		totalItems: number;
		nextCursor: string | null;
		hasNextPage: boolean;
	};
}

export interface OrderResponse extends ApiResponse<OrderData> {}
export interface OrderItemsResponse extends ApiResponse<OrderItem[]> {}
export interface CreateOrderResponse extends ApiResponse<Order> {}

// Error types
export interface ApiError {
	message: string;
	statusCode: number;
	error?: string;
}
