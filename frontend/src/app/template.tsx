"use client";

import { LiveChatWidget } from "@/components/live-chat-widget";
import { createContext, Dispatch, SetStateAction, useState } from "react";

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

	return (
		<LiveChatContext.Provider value={{ isOpen: isLiveChatOpen, setIsOpen: setIsLiveChatOpen }}>
			{children}
			<LiveChatWidget />
		</LiveChatContext.Provider>
	);
}
