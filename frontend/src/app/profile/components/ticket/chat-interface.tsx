"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import axiosInstance from "@/lib/axios";
import { cn, getFallbackString } from "@/lib/utils";
import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MessageInput from "./message-input";
import MessageList from "./message-list";
import { getTicketSocket, useTicketTyping } from "@/lib/ws/ticket";
import { formatRelativeTime } from "@/lib/format";

interface ChatInterfaceProps {
	ticketId: string;
	displayUser?: {
		id: string;
		email: string;
		fullname: string;
		avatarUrl: string | null;
		lastActiveAt: string | null;
	} | null;
	displayUserStatus: "online" | "offline";
}

export default function ChatInterface({ ticketId, displayUser, displayUserStatus }: ChatInterfaceProps) {
	const [isConnected, setIsConnected] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const { isEnemyTyping, handleSetUserTyping } = useTicketTyping(displayUser?.id, ticketId);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const socket = getTicketSocket();

	useEffect(() => {
		if (socket.connected) {
			setIsConnected(true);
		}
	}, [socket.connected]);

	const handleSendMessage = async (content: string, attachments?: File[]) => {
		if (!content.trim() && (!attachments || attachments.length === 0)) return;
		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("content", content);
			formData.append("hasAttachments", attachments && attachments.length > 0 ? "true" : "false");

			attachments?.forEach((file, index) => {
				formData.append("attachments", file);
			});

			await axiosInstance.post(`/ticket/${ticketId}/message`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
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
						<AvatarImage src={displayUser?.avatarUrl ?? undefined} />
						<AvatarFallback className="text-xs">
							{getFallbackString(displayUser?.fullname ?? "Unknown User")}
						</AvatarFallback>
					</Avatar>
					<div className="text-sm">
						<span className="font-medium">{displayUser?.fullname}</span>
						<div className="flex items-center gap-1">
							<div
								className={cn(
									"h-2 w-2 rounded-full",
									displayUserStatus === "online" ? "animate-pulse bg-green-500" : "bg-gray-400",
								)}
							/>
							<span className="text-xs text-gray-600 first-letter:uppercase">
								{displayUserStatus}{" "}
								{displayUserStatus === "offline" &&
									displayUser?.lastActiveAt &&
									formatRelativeTime(displayUser.lastActiveAt)}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Messages Area */}
			<div id="scrollableDiv" className="flex flex-1 flex-col-reverse overflow-y-auto p-4">
				<MessageList ticketId={ticketId} />

				<div ref={messagesEndRef} />
			</div>

			<Separator />

			{/* Typing Indicator */}
			{isEnemyTyping && displayUser && (
				<div className="border-b border-gray-100 px-4 py-2">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<span>{displayUser.fullname} is typing</span>
						<div className="flex gap-1">
							<span className="animate-pulse">.</span>
							<span className="animate-pulse" style={{ animationDelay: "0.2s" }}>
								.
							</span>
							<span className="animate-pulse" style={{ animationDelay: "0.4s" }}>
								.
							</span>
						</div>
					</div>
				</div>
			)}

			{/* Message Input */}
			<div className="p-4">
				<MessageInput
					onSendMessage={handleSendMessage}
					disabled={!isConnected || isLoading}
					isLoading={isLoading}
					onTyping={() => handleSetUserTyping(ticketId)}
				/>
			</div>
		</div>
	);
}
