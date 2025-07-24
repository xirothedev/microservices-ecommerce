"use client";

import axiosInstance from "@/lib/axios";
import { UserQuery } from "@/typings/backend";
import { gql, useMutation as useMutationGql, useQuery as useQueryGql } from "@apollo/client";
import { useCallback, useEffect } from "react";
import { toast } from "./use-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export interface UpdateUserInput {
	fullname?: string;
	address?: string | null;
	biography?: string | null;
	city?: string | null;
	state?: string | null;
	zipCode?: string | null;
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
	const res = useQueryGql<{ me: UserQuery }>(ME_QUERY, {
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
	const { data, called, loading: userLoading } = useUserQuery();

	const [mutate, mutationState] = useMutationGql<{ updateUser: UserQuery }>(
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
			errorPolicy: "all",
			update(cache, { data }) {
				if (!data?.updateUser) return;

				cache.writeQuery({
					query: ME_QUERY,
					data: {
						me: data.updateUser,
					},
				});
			},
			onCompleted: () => {
				toast({
					title: "Success",
					description: "Updated your data",
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

	// Redirect safely using useEffect
	useEffect(() => {
		if (called && !userLoading && !data?.me) {
			router.push("/login");
		}
	}, [called, data?.me, userLoading, router]);

	// Return no-op while waiting or not logged in
	const wrappedMutate = useCallback(
		(input: UpdateUserInput) => {
			if (!data?.me?.id) return Promise.resolve(); // no-op
			return mutate({
				variables: {
					input,
					updateUserId: data.me.id,
				},
			});
		},
		[data?.me?.id, mutate],
	);

	return [wrappedMutate, mutationState] as const;
}

export function useUpdateUserAvatarMutation() {
	const { refetch } = useUserQuery();

	return useMutation({
		mutationFn: async (file: File) => {
			const res = await axiosInstance.putForm("/users/avatar", { avatar: file });

			return res.data;
		},
		onSuccess: async () => {
			await refetch();

			toast({
				title: "Updated avatar",
				variant: "default",
			});
		},
		onError: () => {
			toast({
				title: "An error occurred during updating",
				variant: "destructive",
			});
		},
	});
}
