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
	createAt: string;
	updateAt: string;
	transactionId?: string;
	paymentMethod: "MOMO" | "VIETQR_PAYOS";
	type: "MONEY_OUT" | "MONEY_IN";
	status: "DONE" | "PENDING" | "REFUNDED" | "CANCELLED" | "FAILED";
	amount: number;
	note: string;
}

export interface Order {
	id: string;
	createAt: string;
	updateAt: string;
	totalPrice: number;
	userId: string;
	billId: string;
	bill?: Bill;
	items: OrderItem[];
	user?: {
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

export interface OrdersListResponse extends ApiResponse<Order[]> {
	"@data": {
		totalItems: number;
		nextCursor: string | null;
		hasNextPage: boolean;
	};
}

export interface OrderResponse extends ApiResponse<Order> {}
export interface OrderItemsResponse extends ApiResponse<OrderItem[]> {}
export interface CreateOrderResponse extends ApiResponse<Order> {}

// Error types
export interface ApiError {
	message: string;
	statusCode: number;
	error?: string;
}
