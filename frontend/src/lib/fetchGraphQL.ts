"use client";

import { createApolloClient } from "./apollo-client";
import { gql } from "@apollo/client";

export const fetchGraphQL = async (query: string, variables = {}) => {
	const client = createApolloClient();

	const result = await client.query({
		query: gql(query),
		variables,
		// fetchPolicy: 'no-cache',
	});

	return result.data;
};
