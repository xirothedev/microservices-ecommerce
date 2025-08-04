import type { CartItemWithProduct } from "@/typings/backend";

// Base API response interface
export interface ApiResponse<T> {
	message: string;
	data: T;
}

// Cart item update request
export interface UpdateCartRequest {
	productId: string;
	quantity: number;
}

// Cart item update response
export interface UpdateCartResponse extends ApiResponse<CartItemWithProduct> {}

// Cart items query response (for GraphQL)
export interface CartItemsQueryResponse {
	cartItems: CartItemGQL[];
}

// Cart item for GraphQL query
export interface CartItemGQL {
	id: string;
	productId: string;
	quantity: number;
	createAt: string;
	updateAt: string;
	product: {
		id: string;
		name: string;
		discountPrice: number;
		medias: string[];
		category: {
			id: string;
			name: string;
		};
	};
}

// Transformed cart item for UI components
export interface CartItem {
	id: string;
	title: string;
	price: number;
	quantity: number;
	image: string | null;
	category: string;
	productId: string;
}
