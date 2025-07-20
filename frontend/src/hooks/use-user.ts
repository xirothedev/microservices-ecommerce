"use client";

import axiosInstance from "@/lib/axios";
import { UserQuery } from "@/typings/backend";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";

export function useUser() {
	const res = useQuery<{ me: UserQuery }>(
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
				}
			}
		`,
		{
			fetchPolicy: "network-only",
			errorPolicy: "all",
			ssr: true,
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
