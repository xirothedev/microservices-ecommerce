"use client";

import { useUserQuery } from "@/lib/api/user";

export default function TestUnprotectedPage() {
	const { data, loading, error } = useUserQuery();

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className="p-8">
			<h1 className="mb-4 text-2xl font-bold">Test Unprotected Page</h1>
			<p className="mb-4">
				This page is NOT wrapped with ProtectedProvider, so users should NOT be redirected to login when token
				refresh fails.
			</p>
			{data ? (
				<div>
					<p>User is logged in: {data.me.email}</p>
				</div>
			) : (
				<div>
					<p>User is not logged in, but should stay on this page</p>
				</div>
			)}
		</div>
	);
}
