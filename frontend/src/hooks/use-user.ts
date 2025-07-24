"use client";

import axiosInstance from "@/lib/axios";
import { UserQuery } from "@/typings/backend";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { toast } from "./use-toast";
import { useRouter } from "next/navigation";

export interface UpdateUserInput {
	address?: string;
	biography?: string;
	city?: string;
	fullname?: string;
	state?: string;
	zipCode?: string;
}

const ME_QUERY = gql`
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
			biography
		}
	}
`;

export function useUserQuery() {
	const res = useQuery<{ me: UserQuery }>(ME_QUERY, {
		fetchPolicy: "network-only",
		errorPolicy: "all",
		ssr: true,
	});

	useEffect(() => {
		const handleUnauthenticated = async () => {
			const isUnauthenticated = res.error?.graphQLErrors?.some(
				(err) => err.extensions?.code === "UNAUTHENTICATED",
			);

			if (isUnauthenticated) {
				try {
					await axiosInstance.post("/auth/refresh-token");

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

export function useUpdateUserMutation() {
	const router = useRouter();
	const { data } = useUserQuery();

	const [mutate, mutationState] = useMutation<{ me: UserQuery }>(
		gql`
			mutation UpdateUser($input: UpdateUserInput!, $updateUserId: String!) {
				updateUser(input: $input, id: $updateUserId) {
					address
					avatarUrl
					biography
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
			update(cache, { data }) {
				if (!data?.me) return;

				cache.writeQuery({
					query: ME_QUERY,
					data: {
						me: data.me,
					},
				});
			},
			onCompleted: () => {
				toast({
					title: "Success",
					description: "Updated your dataa",
					variant: "default",
				});
			},
			onError: () => {
				toast({
					title: "Error",
					description: "An error occurred during updating",
					variant: "destructive",
				});
			},
		},
	);

	// Redirect if not logged in
	if (!data?.me || !data.me.id) {
		router.push("/login");
		// Return a no-op mutation function and default state
		return [() => Promise.resolve(), { ...mutationState, called: false, loading: false, data: undefined }];
	}

	// Wrap mutate to always provide the correct variables
	const wrappedMutate = (input: UpdateUserInput) =>
		mutate({
			variables: {
				input,
				updateUserId: data.me.id,
			},
		});

	return [wrappedMutate, mutationState];
}
