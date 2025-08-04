"use client";

import { useUserQuery } from "@/lib/api/user";
import { UserRole } from "@/typings/backend";
import { forbidden, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedProvider({
	children,
	roles = ["USER"],
}: {
	children: React.ReactNode;
	roles?: UserRole[];
}) {
	const router = useRouter();
	const { data, loading } = useUserQuery();

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
