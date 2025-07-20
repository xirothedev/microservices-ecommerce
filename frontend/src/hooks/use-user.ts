"use client";

import axiosInstance from "@/lib/axios";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";

export function useUser() {
	const res = useQuery(
		gql`
			query Me {
				me {
					address
					avatarUrl
					city
					createAt
					credit
					email
					flags
					fullname
					id
					isVerified
					phone
					roles
					state
					updateAt
					zipCode
					cart {
						createAt
						id
						productId
						quantity
						unitPrice
						updateAt
						userId
						product {
							categoryId
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
					}
				}
			}
		`,
		{
			fetchPolicy: "network-only",
			errorPolicy: "all",
		},
	);

	useEffect(() => {
		const handleUnauthenticated = async () => {
			const isUnauthenticated = res.error?.graphQLErrors?.some(
				(err) => err.extensions?.code === "UNAUTHENTICATED",
			);

			if (isUnauthenticated) {
				try {
					await axiosInstance.post("/auth/refresh-token");

					console.log("Refreshed");
					res.refetch();
				} catch (err) {
					console.error("Failed to refresh token", err);
				}
			}
		};

		handleUnauthenticated();
	}, [res]);

	return res;
}
