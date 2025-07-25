"use client";

import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { refreshToken } from "@/lib/refresh-token";
import { fromPromise } from "@apollo/client";
import { Observable } from "@apollo/client/utilities";

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

function resolvePendingRequests() {
	pendingRequests.forEach((callback) => callback());
	pendingRequests = [];
}

const authErrorLink = onError(({ graphQLErrors, operation, forward }) => {
	const unauthenticated = graphQLErrors?.some((err) => err.extensions?.code === "UNAUTHENTICATED");

	if (!unauthenticated) return;

	if (!isRefreshing) {
		isRefreshing = true;

		return fromPromise(
			refreshToken()
				.then((ok) => {
					if (!ok) {
						window.location.href = "/login";
						return;
					}
					resolvePendingRequests();
					return true;
				})
				.catch(() => {
					window.location.href = "/login";
				})
				.finally(() => {
					isRefreshing = false;
				}),
		).flatMap(() => forward(operation));
	}

	return fromPromise(
		new Promise<void>((resolve) => {
			pendingRequests.push(() => resolve());
		}),
	).flatMap(() => forward(operation));
});

const httpLink = new HttpLink({
	uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
	credentials: "include",
});

export const apolloClient = new ApolloClient({
	link: from([authErrorLink, httpLink]),
	cache: new InMemoryCache({
		typePolicies: {
			UserQL: {
				keyFields: ["id"],
			},
		},
	}),
});
