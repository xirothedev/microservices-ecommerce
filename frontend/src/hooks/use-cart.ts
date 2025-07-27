"use client";

import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios";
import { CartItemWithProduct } from "@/typings/backend";
import { gql, useQuery } from "@apollo/client";
import { useMutation } from "@tanstack/react-query";

export function useUpdateCart(isRemove = false, refetch: () => void) {
	return useMutation<{ data: CartItemWithProduct }, unknown, { productId: string; quantity: number }>({
		mutationFn: async ({ productId, quantity }) => {
			const res = await axiosInstance.post<{ data: CartItemWithProduct }>(
				`/cart/${isRemove ? "remove" : "add"}`,
				{ productId, quantity },
			);
			return res.data;
		},
		onSuccess: () => {
			refetch();
			toast({ title: `${isRemove ? "Removed" : "Added"} product to cart` });
		},
	});
}

export function useCart() {
	const res = useQuery<{ cartItems: CartItemWithProduct[] }>(
		gql`
			query CartItems {
				cartItems {
					id
					productId
					quantity
					product {
						id
						name
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
			fetchPolicy: "cache-and-network", // Improved fetch policy for better UX
			nextFetchPolicy: "cache-first",
			errorPolicy: "all",
			ssr: true,
			onError: (error) => {
				console.error("Error fetching cart items:", error);

				toast({
					title: "Error",
					description: "Could not load your cart. Please try again.",
					variant: "destructive",
				});
			},
		},
	);

	return res;
}
