import { ProductWithCategory } from "./product";

export interface CartItem {
	id: string;
	createdAt: string;
	updatedAt: string;
	quantity: number;
	productId: string;
	userId: string;
}

export interface CartItemDetail extends CartItem {
	title: string;
	price: number;
	image: string | null;
	category: string;
}

export interface CartItemWithProduct extends CartItem {
	product: ProductWithCategory;
	productId: string;
}

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
	createdAt: string;
	updatedAt: string;
	userId: string;
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
