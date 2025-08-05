import axiosInstance from "@/lib/axios";
import { apolloClient } from "@/lib/apollo-client";
import { toast } from "@/hooks/use-toast";
import { gql, useMutation as useMutationGql, useQuery as useQueryGql } from "@apollo/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import {
	UpdateUserInput,
	UserQueryResponse,
	UpdateUserMutationResponse,
	UpdateAvatarResponse,
	UserProfile,
} from "@/@types/api/user";

// GraphQL queries and mutations
const ME_QUERY = gql`
	query Me {
		me {
			address
			avatarUrl
			city
			createdAt
			credit
			email
			flags
			fullname
			id
			isVerified
			phone
			roles
			state
			updatedAt
			zipCode
			biography
		}
	}
`;

const UPDATE_USER_MUTATION = gql`
	mutation UpdateUser($input: UpdateUserInput!, $updateUserId: String!) {
		updateUser(input: $input, id: $updateUserId) {
			address
			avatarUrl
			biography
			city
			createdAt
			credit
			email
			flags
			fullname
			id
			isVerified
			phone
			roles
			state
			updatedAt
			zipCode
		}
	}
`;

class UserApi {
	/**
	 * Update user avatar
	 */
	async updateAvatar(file: File): Promise<UpdateAvatarResponse> {
		const response = await axiosInstance.putForm<UpdateAvatarResponse>("/users/avatar", { avatar: file });
		return response.data;
	}

	/**
	 * Get user profile (REST API alternative)
	 */
	async getUserProfile(): Promise<UserProfile> {
		const response = await axiosInstance.get<{ data: UserProfile }>("/users/me");
		return response.data.data;
	}

	/**
	 * Update user profile (REST API alternative)
	 */
	async updateUserProfile(data: UpdateUserInput): Promise<UserProfile> {
		const response = await axiosInstance.put<{ data: UserProfile }>("/users/me", data);
		return response.data.data;
	}
}

// Export singleton instance
export const userApi = new UserApi();

// Export individual methods for convenience
export const { updateAvatar, getUserProfile, updateUserProfile } = userApi;

// ============================================================================
// REACT HOOKS FOR USER
// ============================================================================

/**
 * Hook for fetching user data with Apollo GraphQL
 */
export function useUserQuery() {
	const res = useQueryGql<UserQueryResponse>(ME_QUERY, {
		fetchPolicy: "cache-and-network",
		nextFetchPolicy: "cache-first",
		errorPolicy: "all",
		ssr: true,
	});

	return res;
}

/**
 * Hook for updating user profile with Apollo GraphQL
 */
export function useUpdateUserMutation() {
	const { data } = useUserQuery();

	const [mutate, mutationState] = useMutationGql<UpdateUserMutationResponse>(UPDATE_USER_MUTATION, {
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
	});

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

/**
 * Hook for updating user avatar with React Query
 */
export function useUpdateUserAvatarMutation() {
	const { refetch } = useUserQuery();

	return useMutation<UpdateAvatarResponse, unknown, File>({
		mutationFn: async (file: File) => {
			return await userApi.updateAvatar(file);
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

/**
 * Hook for updating user profile with React Query (REST API)
 */
export function useUpdateUserProfile() {
	const { refetch } = useUserQuery();

	return useMutation<UserProfile, unknown, UpdateUserInput>({
		mutationFn: async (data: UpdateUserInput) => {
			return await userApi.updateUserProfile(data);
		},
		onSuccess: async () => {
			await refetch();

			toast({
				title: "Success",
				description: "Profile updated successfully",
				variant: "default",
			});
		},
		onError: (error: unknown) => {
			console.error("Update profile error:", error);
			toast({
				title: "Error",
				description: "Failed to update profile. Please try again.",
				variant: "destructive",
			});
		},
	});
}

/**
 * Hook for fetching user profile with React Query (REST API)
 */
export function useUserProfile() {
	return useMutation<UserProfile, unknown, void>({
		mutationFn: async () => {
			return await userApi.getUserProfile();
		},
		onError: (error: unknown) => {
			console.error("Fetch profile error:", error);
			toast({
				title: "Error",
				description: "Failed to fetch profile. Please try again.",
				variant: "destructive",
			});
		},
	});
}
