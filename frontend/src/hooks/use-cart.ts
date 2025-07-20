"use client";

import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios";
import { CartItemWithProduct } from "@/typings/backend";
import { gql, useQuery } from "@apollo/client";
import { useMutation } from "@tanstack/react-query";

export function useUpdateCart(isRemove = false) {
	return useMutation({
		mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
			const res = await axiosInstance.post(`/cart/${isRemove ? "remove" : "add"}`, { productId, quantity });
			return res.data;
		},
		onSuccess: () => {
			toast({ title: `${isRemove ? "Removed" : "Added"} product to cart` });
		},
	});
}

export function useCart() {
	const res = useQuery<{ me: { cart: CartItemWithProduct[] } }>(
		gql`
			query Me {
				me {
					cart {
						createAt
						id
						product {
							categoryId
							category {
								name
								id
								slug
							}
							createAt
							description
							discountPrice
							flags
							id
							isActive
							medias
							name
							originalPrice
							sellerId
							sku
							slug
							sold
							stock
							tags
							updateAt
						}
						productId
						quantity
						unitPrice
						updateAt
						userId
					}
				}
			}
		`,
		{
			fetchPolicy: "network-only",
			errorPolicy: "all",
		},
	);

	console.log(res.data);

	return res;
}
