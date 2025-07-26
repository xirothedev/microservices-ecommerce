"use client";

import { apolloClient } from "@/lib/apollo-client";
import axiosInstance from "@/lib/axios";
import { UserQuery } from "@/typings/backend";
import { gql, useMutation as useMutationGql, useQuery as useQueryGql } from "@apollo/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "./use-toast";

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
		fetchPolicy: "cache-and-network",
		nextFetchPolicy: "cache-first",
		errorPolicy: "all",
		ssr: true,
	});

	return res;
}

export function useUpdateUserMutation() {
	const { data } = useUserQuery();

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
			onCompleted: (data) => {
				if (data?.updateUser) {
					apolloClient.cache.writeQuery({
						query: ME_QUERY,
						data: {
							me: data.updateUser,
						},
					});

					toast({
						title: "Success",
						description: "Updated your data",
						variant: "default",
					});
				}
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
