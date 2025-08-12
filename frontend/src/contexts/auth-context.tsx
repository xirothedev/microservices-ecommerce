"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AuthMode = "login" | "register";

interface AuthContextType {
	isAuthModalOpen: boolean;
	authMode: AuthMode;
	openAuthModal: (mode: AuthMode) => void;
	closeAuthModal: () => void;
	setAuthMode: (mode: AuthMode) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [authMode, setAuthMode] = useState<AuthMode>("register");

	const openAuthModal = (mode: AuthMode) => {
		setAuthMode(mode);
		setIsAuthModalOpen(true);
	};

	const closeAuthModal = () => {
		setIsAuthModalOpen(false);
	};

	const value: AuthContextType = {
		isAuthModalOpen,
		authMode,
		openAuthModal,
		closeAuthModal,
		setAuthMode,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
