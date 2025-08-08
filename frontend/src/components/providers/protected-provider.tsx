"use client";

import { useUserQuery } from "@/lib/api/user";
import { setProtectedContext } from "@/lib/refresh-token";
import { UserRole } from "@/@types/api/user";
import { forbidden, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedProvider({
	children,
	roles = [UserRole.USER],
}: {
	children: React.ReactNode;
	roles?: UserRole[];
}) {
	const router = useRouter();
	const { data, loading } = useUserQuery();

	// Set protected context when component mounts
	useEffect(() => {
		setProtectedContext(true);

		// Cleanup: reset protected context when component unmounts
		return () => {
			setProtectedContext(false);
		};
	}, []);

	useEffect(() => {
		if (!loading) {
			if (!data) {
				router.push("/login");
			} else if (roles && !roles.every((role) => data.me.roles.includes(role))) {
				forbidden();
			}
		}
	}, [data, loading, roles, router]);

	return <>{children}</>;
}
