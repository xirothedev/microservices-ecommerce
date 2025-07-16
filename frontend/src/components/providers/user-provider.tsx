"use client";

import { useUser } from "@/hooks/use-auth";
import type { ReactNode } from "react";

export default function UserProvider({ children }: { children: ReactNode }) {
	// This will trigger the query and cache the result
	useUser();

	return <>{children}</>;
}
