"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, ImageIcon } from "lucide-react";
import { motion } from "motion/react";

interface Message {
	id: string;
	content: string;
	sender: {
		id: string;
		name: string;
		avatar: string;
		type: "user" | "agent";
	};
	timestamp: string;
	attachments?: Array<{
		id: string;
		name: string;
		url: string;
		type: string;
	}>;
	isRead: boolean;
}

interface MessageListProps {
	messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 24) {
			return date.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			});
		} else {
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			});
		}
	};

	const getFileIcon = (type: string) => {
		if (type.startsWith("image/")) {
			return <ImageIcon className="h-4 w-4" />;
		}
		return <FileText className="h-4 w-4" />;
	};

	const formatFileSize = (_url: string): string => {
		// In a real app, you'd get this from the file metadata
		return "245 KB";
	};

	return (
		<div className="space-y-4">
			{messages.map((message, index) => {
				const isUser = message.sender.type === "user";
				const showAvatar = index === 0 || messages[index - 1].sender.id !== message.sender.id;
				const showTimestamp =
					index === messages.length - 1 ||
					messages[index + 1].sender.id !== message.sender.id ||
					new Date(messages[index + 1].timestamp).getTime() - new Date(message.timestamp).getTime() > 300000; // 5 minutes

				return (
					<motion.div
						key={message.id}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
					>
						{/* Avatar */}
						<div className="flex-shrink-0">
							{showAvatar ? (
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={
											message.sender.avatar ||
											"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
										}
									/>
									<AvatarFallback className="text-xs">
										{message.sender.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
							) : (
								<div className="h-8 w-8" />
							)}
						</div>

						{/* Message Content */}
						<div className={`max-w-[70%] flex-1 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
							{/* Sender Name (only show for first message in group) */}
							{showAvatar && !isUser && (
								<div className="mb-1 flex items-center gap-2">
									<span className="text-sm font-medium text-gray-900">{message.sender.name}</span>
									<Badge variant="secondary" className="bg-blue-100 text-xs text-blue-800">
										Support Agent
									</Badge>
								</div>
							)}

							{/* Message Bubble */}
							<div
								className={`rounded-lg px-4 py-2 ${isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}
							>
								<p className="text-sm whitespace-pre-wrap">{message.content}</p>

								{/* Attachments */}
								{message.attachments && message.attachments.length > 0 && (
									<div className="mt-3 space-y-2">
										{message.attachments.map((attachment) => (
											<div
												key={attachment.id}
												className={`flex items-center gap-2 rounded p-2 ${isUser ? "bg-blue-500" : "border bg-white"}`}
											>
												<div
													className={`rounded p-1 ${isUser ? "bg-blue-400" : "bg-gray-100"}`}
												>
													{getFileIcon(attachment.type)}
												</div>
												<div className="min-w-0 flex-1">
													<p
														className={`truncate text-xs font-medium ${isUser ? "text-blue-100" : "text-gray-900"}`}
													>
														{attachment.name}
													</p>
													<p
														className={`text-xs ${isUser ? "text-blue-200" : "text-gray-500"}`}
													>
														{formatFileSize(attachment.url)}
													</p>
												</div>
												<Button
													variant="ghost"
													size="sm"
													className={`h-6 w-6 p-0 ${
														isUser
															? "text-blue-100 hover:bg-blue-500 hover:text-white"
															: "text-gray-500 hover:text-gray-700"
													}`}
												>
													<Download className="h-3 w-3" />
												</Button>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Timestamp and Read Status */}
							{showTimestamp && (
								<div
									className={`mt-1 flex items-center gap-2 text-xs text-gray-500 ${
										isUser ? "flex-row-reverse" : "flex-row"
									}`}
								>
									<span>{formatTime(message.timestamp)}</span>
									{isUser && (
										<span className={message.isRead ? "text-blue-600" : "text-gray-400"}>
											{message.isRead ? "✓✓" : "✓"}
										</span>
									)}
								</div>
							)}
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}
