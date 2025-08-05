"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import axiosInstance from "@/lib/axios";
import { Wifi, WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import MessageInput from "./message-input";
import MessageList from "./message-list";

interface ChatInterfaceProps {
	ticketId: string;
}

export default function ChatInterface({ ticketId }: ChatInterfaceProps) {
	const [isConnected, _setIsConnected] = useState(true);
	const [isAgentTyping, _setIsAgentTyping] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	console.log("🔄 ChatInterface render - ticketId:", ticketId);

	const handleSendMessage = async (content: string, attachments?: File[]) => {
		if (!content.trim() && (!attachments || attachments.length === 0)) return;
		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("content", content);

			// Add hasAttachments flag
			const hasAttachments = attachments && attachments.length > 0;
			formData.append("hasAttachments", hasAttachments?.toString() ?? "false");

			if (attachments) {
				attachments.forEach((file) => formData.append("attachments", file));
			}
			await axiosInstance.post(`/ticket/${ticketId}/message`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			// The backend will broadcast the new message via socket.io, so no need to add it manually
		} catch (err) {
			console.error("Failed to send message", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex h-[800px] flex-col">
			{/* Connection Status */}
			<div className="flex items-center justify-between border-b bg-gray-50 p-3">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2">
						{isConnected ? (
							<Wifi className="h-4 w-4 text-green-600" />
						) : (
							<WifiOff className="h-4 w-4 text-red-600" />
						)}
						<span className="text-sm font-medium">{isConnected ? "Connected" : "Reconnecting..."}</span>
					</div>
					{isConnected && (
						<Badge variant="secondary" className="bg-green-100 text-xs text-green-800">
							Live Chat
						</Badge>
					)}
				</div>

				<div className="flex items-center gap-2">
					<Avatar className="h-6 w-6">
						<AvatarImage src="https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=24&width=24" />
						<AvatarFallback className="text-xs">SJ</AvatarFallback>
					</Avatar>
					<div className="text-sm">
						<span className="font-medium">Sarah Johnson</span>
						<div className="flex items-center gap-1">
							<div className="h-2 w-2 rounded-full bg-green-500" />
							<span className="text-xs text-gray-600">Online</span>
						</div>
					</div>
				</div>
			</div>

			{/* Messages Area */}
			<div id="scrollableDiv" className="flex flex-1 flex-col-reverse overflow-y-auto p-4">
				<MessageList ticketId={ticketId} />

				{/* Agent Typing Indicator */}
				<AnimatePresence>
					{isAgentTyping && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="mb-4 flex items-center gap-3"
						>
							<Avatar className="h-8 w-8">
								<AvatarImage src="https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32" />
								<AvatarFallback className="text-xs">SJ</AvatarFallback>
							</Avatar>
							<div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
								<div className="flex gap-1">
									<div
										className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
										style={{ animationDelay: "0ms" }}
									/>
									<div
										className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
										style={{ animationDelay: "150ms" }}
									/>
									<div
										className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
										style={{ animationDelay: "300ms" }}
									/>
								</div>
								<span className="text-xs text-gray-600">Sarah is typing...</span>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<div ref={messagesEndRef} />
			</div>

			<Separator />

			{/* Message Input */}
			<div className="p-4">
				<MessageInput
					onSendMessage={handleSendMessage}
					disabled={!isConnected || isLoading}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}
