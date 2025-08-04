"use client";

import { createContext, useContext, ReactNode } from "react";

interface ProtectedContextType {
	isProtected: boolean;
}

const ProtectedContext = createContext<ProtectedContextType>({
	isProtected: false,
});

export function useProtectedContext() {
	return useContext(ProtectedContext);
}

interface ProtectedContextProviderProps {
	children: ReactNode;
	isProtected: boolean;
}

export function ProtectedContextProvider({ children, isProtected }: ProtectedContextProviderProps) {
	return <ProtectedContext.Provider value={{ isProtected }}>{children}</ProtectedContext.Provider>;
}
