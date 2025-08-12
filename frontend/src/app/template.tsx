"use client";

import { useAutoUpdateUserStatus } from "@/lib/ws/users";
import dynamic from "next/dynamic";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import AuthModal from "@/components/auth-modals";
import { useAuth } from "@/contexts/auth-context";

const LiveChatWidget = dynamic(() => import("@/components/live-chat-widget").then((comp) => comp.LiveChatWidget), {
	ssr: false,
});

interface LiveChatContextType {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LiveChatContext = createContext<LiveChatContextType>({
	isOpen: false,
	setIsOpen: () => false,
});

export default function TemplateRoot({ children }: { children: React.ReactNode }) {
	const [isLiveChatOpen, setIsLiveChatOpen] = useState<boolean>(false);
	const { isAuthModalOpen, authMode, closeAuthModal, setAuthMode } = useAuth();
	const {} = useAutoUpdateUserStatus();

	return (
		<LiveChatContext.Provider value={{ isOpen: isLiveChatOpen, setIsOpen: setIsLiveChatOpen }}>
			{children}
			<LiveChatWidget />

			{/* Global Auth Modal */}
			<AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} mode={authMode} setMode={setAuthMode} />
		</LiveChatContext.Provider>
	);
}
