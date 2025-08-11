import { CartItemDetail, CartItemsQueryResponse, UpdateCartRequest, UpdateCartResponse } from "@/@types/api/cart";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios";
import { gql, useQuery } from "@apollo/client";
import { useMutation } from "@tanstack/react-query";

class CartApi {
	/**
	 * Add item to cart
	 */
	async addToCart(data: UpdateCartRequest): Promise<UpdateCartResponse> {
		const response = await axiosInstance.post<UpdateCartResponse>("/cart/add", data);
		return response.data;
	}

	/**
	 * Remove item from cart
	 */
	async removeFromCart(data: UpdateCartRequest): Promise<UpdateCartResponse> {
		const response = await axiosInstance.post<UpdateCartResponse>("/cart/remove", data);
		return response.data;
	}

	/**
	 * Clear entire cart
	 */
	async clearCart(): Promise<void> {
		await axiosInstance.delete("/cart/clear");
	}
}

// Export singleton instance
export const cartApi = new CartApi();

// Export individual methods for convenience
export const { addToCart, removeFromCart, clearCart } = cartApi;

// ============================================================================
// REACT HOOKS FOR CART
// ============================================================================

/**
 * Hook for updating cart (add/remove) with React Query
 */
export function useUpdateCart(isRemove = false, refetch: () => void) {
	return useMutation<UpdateCartResponse, unknown, UpdateCartRequest>({
		mutationFn: async (data: UpdateCartRequest) => {
			if (isRemove) {
				return await cartApi.removeFromCart(data);
			} else {
				return await cartApi.addToCart(data);
			}
		},
		onSuccess: () => {
			refetch();
			toast({
				title: `${isRemove ? "Removed" : "Added"} product to cart`,
				variant: "default",
			});
		},
		onError: (error: unknown) => {
			console.error("Cart update error:", error);
			toast({
				title: "Error",
				description: `Failed to ${isRemove ? "remove" : "add"} product to cart. Please try again.`,
				variant: "destructive",
			});
		},
	});
}

/**
 * Hook for fetching cart items with Apollo GraphQL
 * Returns a comprehensive cart interface with items and utility functions
 */
export function useCart() {
	const queryResult = useQuery<CartItemsQueryResponse>(
		gql`
			query CartItems {
				cartItems {
					id
					productId
					quantity
					createdAt
					updatedAt
					userId
					product {
						id
						name
						isActive
						discountPrice
						medias
						category {
							id
							name
						}
					}
				}
			}
		`,
		{
			context: { handleAuthError: true },
			fetchPolicy: "cache-and-network",
			nextFetchPolicy: "cache-first",
			errorPolicy: "all",
			ssr: true,
			onError: (error) => {
				console.error("Error fetching cart items:", error);
				if (error.graphQLErrors) {
					error.graphQLErrors.forEach((err) => {
						if (err.extensions?.code !== "UNAUTHENTICATED") {
							toast({
								title: "Error",
								description: "Could not load your cart. Please try again.",
								variant: "destructive",
							});
						}
					});
				}
			},
		},
	);

	// Transform GraphQL data to expected format with stable sorting
	const items: CartItemDetail[] = (queryResult.data?.cartItems || []).map((cartItem) => ({
		id: cartItem.id,
		title: cartItem.product.name,
		price: cartItem.product.discountPrice,
		quantity: cartItem.quantity,
		isActive: cartItem.product.isActive,
		image: cartItem.product.medias[0] || null,
		category: cartItem.product.category.name,
		productId: cartItem.productId,
		createdAt: cartItem.createdAt,
		updatedAt: cartItem.updatedAt,
		userId: cartItem.userId,
	}));

	// Utility functions
	const getTotalItems = () => {
		return items.reduce((total, item) => total + item.quantity, 0);
	};

	const getTotalPrice = () => {
		return items.reduce((total, item) => total + item.price * item.quantity, 0);
	};

	// Initialize mutations outside of functions to follow Rules of Hooks
	const updateMutation = useUpdateCart(false, queryResult.refetch);
	const removeMutation = useUpdateCart(true, queryResult.refetch);
	const clearMutation = useClearCart(queryResult.refetch);

	const updateQuantity = (itemId: string, newQuantity: number) => {
		if (newQuantity <= 0) {
			removeFromCart(itemId);
			return;
		}

		const item = items.find((item) => item.id === itemId);
		if (item) {
			updateMutation.mutate({
				productId: item.productId,
				quantity: newQuantity - item.quantity, // Send the difference
			});
		}
	};

	const removeFromCart = (itemId: string) => {
		const item = items.find((item) => item.id === itemId);
		if (item) {
			removeMutation.mutate({
				productId: item.productId,
				quantity: item.quantity,
			});
		}
	};

	const clearCart = () => {
		clearMutation.mutate();
	};

	return {
		...queryResult,
		items,
		updateQuantity,
		removeFromCart,
		clearCart,
		getTotalItems,
		getTotalPrice,
	};
}

/**
 * Hook for clearing cart with React Query
 */
export function useClearCart(refetch: () => void) {
	return useMutation<void, unknown, void>({
		mutationFn: async () => {
			await cartApi.clearCart();
		},
		onSuccess: () => {
			refetch();
			toast({
				title: "Cart cleared",
				description: "All items have been removed from your cart.",
				variant: "default",
			});
		},
		onError: (error: unknown) => {
			console.error("Clear cart error:", error);
			toast({
				title: "Error",
				description: "Failed to clear cart. Please try again.",
				variant: "destructive",
			});
		},
	});
}
