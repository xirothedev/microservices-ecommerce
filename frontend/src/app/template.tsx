"use client";

import { useAutoUpdateUserStatus } from "@/lib/ws/users";
import dynamic from "next/dynamic";
import { createContext, Dispatch, SetStateAction, useState } from "react";

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
	const {} = useAutoUpdateUserStatus();

	return (
		<LiveChatContext.Provider value={{ isOpen: isLiveChatOpen, setIsOpen: setIsLiveChatOpen }}>
			{children}
			<LiveChatWidget />
		</LiveChatContext.Provider>
	);
}
