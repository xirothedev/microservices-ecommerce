import type { UserQuery } from "@/@types/backend";

// Base API response interface
export interface ApiResponse<T> {
	message: string;
	data: T;
}

// Update user input interface
export interface UpdateUserInput {
	fullname?: string;
	address?: string | null;
	biography?: string | null;
	city?: string | null;
	state?: string | null;
	zipCode?: string | null;
}

// User query response (for GraphQL)
export interface UserQueryResponse {
	me: UserQuery;
}

// Update user mutation response (for GraphQL)
export interface UpdateUserMutationResponse {
	updateUser: UserQuery;
}

// Update avatar response
export interface UpdateAvatarResponse
	extends ApiResponse<{
		avatarUrl: string;
	}> {}

// User profile data
export type UserProfile = UserQuery;
