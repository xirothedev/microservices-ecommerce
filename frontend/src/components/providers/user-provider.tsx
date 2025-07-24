"use client";

import { useUserQuery } from "@/hooks/use-user";
import type { ReactNode } from "react";

export default function UserProvider({ children }: { children: ReactNode }) {
	// This will trigger the query and cache the result
	useUserQuery();

	return <>{children}</>;
}
