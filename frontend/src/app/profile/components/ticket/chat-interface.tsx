"use client";

import { useState, useEffect, useRef } from "react";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

interface ChatInterfaceProps {
	ticketId: string;
}

// Mock messages data
const mockMessages: Message[] = [
	{
		id: "msg-1",
		content:
			"I purchased the Apple ID Premium Setup service yesterday but I'm unable to access the setup instructions. When I try to log into my account, I get an error message saying 'Service not found'.",
		sender: {
			id: "user-1",
			name: "John Doe",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			type: "user",
		},
		timestamp: "2024-01-15T10:30:00Z",
		attachments: [
			{
				id: "att-1",
				name: "error-screenshot.png",
				url: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=200&width=300",
				type: "image/png",
			},
		],
		isRead: true,
	},
	{
		id: "msg-2",
		content:
			"Hello John! Thank you for contacting us. I'm Sarah and I'll be helping you with your Apple ID Premium Setup issue. I can see that you've attached a screenshot of the error. Let me investigate this for you right away.",
		sender: {
			id: "agent-1",
			name: "Sarah Johnson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			type: "agent",
		},
		timestamp: "2024-01-15T10:35:00Z",
		isRead: true,
	},
	{
		id: "msg-3",
		content:
			"I've checked your account and I can see the purchase was successful. The issue seems to be related to a temporary sync problem with our service activation system. I'm going to manually activate your service now.",
		sender: {
			id: "agent-1",
			name: "Sarah Johnson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			type: "agent",
		},
		timestamp: "2024-01-15T10:42:00Z",
		isRead: true,
	},
	{
		id: "msg-4",
		content:
			"Great! I can now see the setup instructions in my account. However, I'm having trouble with step 3 - the verification code isn't being sent to my email.",
		sender: {
			id: "user-1",
			name: "John Doe",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			type: "user",
		},
		timestamp: "2024-01-15T11:15:00Z",
		isRead: true,
	},
	{
		id: "msg-5",
		content:
			"I understand the frustration. Let me check your email settings and resend the verification code. Can you please confirm the email address associated with your account? Also, please check your spam/junk folder just in case.",
		sender: {
			id: "agent-1",
			name: "Sarah Johnson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			type: "agent",
		},
		timestamp: "2024-01-15T11:18:00Z",
		isRead: true,
	},
	{
		id: "msg-6",
		content:
			"The email is john.doe@example.com and I've checked spam folder - nothing there. Should I try a different email address?",
		sender: {
			id: "user-1",
			name: "John Doe",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			type: "user",
		},
		timestamp: "2024-01-15T11:25:00Z",
		isRead: true,
	},
	{
		id: "msg-7",
		content:
			"I've just resent the verification code to john.doe@example.com. It should arrive within the next 2-3 minutes. If you still don't receive it, we can try using an alternative email address or I can provide you with a manual verification process.",
		sender: {
			id: "agent-1",
			name: "Sarah Johnson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			type: "agent",
		},
		timestamp: "2024-01-15T11:28:00Z",
		isRead: true,
	},
	{
		id: "msg-8",
		content:
			"Perfect! I just received the verification code and was able to complete the setup. Thank you so much for your quick help, Sarah!",
		sender: {
			id: "user-1",
			name: "John Doe",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			type: "user",
		},
		timestamp: "2024-01-15T11:32:00Z",
		isRead: false,
	},
];

export default function ChatInterface({}: ChatInterfaceProps) {
	const [messages, setMessages] = useState<Message[]>(mockMessages);
	const [isConnected, setIsConnected] = useState(true);
	const [isAgentTyping, setIsAgentTyping] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Simulate connection status
	useEffect(() => {
		const interval = setInterval(() => {
			// Randomly simulate connection issues (very rarely)
			if (Math.random() < 0.02) {
				setIsConnected(false);
				setTimeout(() => setIsConnected(true), 2000);
			}
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isAgentTyping]);

	// Simulate agent typing
	const simulateAgentTyping = () => {
		setIsAgentTyping(true);
		setTimeout(
			() => {
				setIsAgentTyping(false);
				// Simulate agent response
				const agentResponse: Message = {
					id: `msg-${Date.now()}`,
					content:
						"Thank you for the update! I'm glad we could resolve this issue quickly. Is there anything else I can help you with regarding your Apple ID Premium Setup?",
					sender: {
						id: "agent-1",
						name: "Sarah Johnson",
						avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
						type: "agent",
					},
					timestamp: new Date().toISOString(),
					isRead: false,
				};
				setMessages((prev) => [...prev, agentResponse]);
			},
			2000 + Math.random() * 3000,
		); // Random delay between 2-5 seconds
	};

	const handleSendMessage = async (content: string, attachments?: File[]) => {
		if (!content.trim() && (!attachments || attachments.length === 0)) return;

		setIsLoading(true);

		// Create user message
		const userMessage: Message = {
			id: `msg-${Date.now()}`,
			content,
			sender: {
				id: "user-1",
				name: "John Doe",
				avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
				type: "user",
			},
			timestamp: new Date().toISOString(),
			attachments: attachments?.map((file, index) => ({
				id: `att-${Date.now()}-${index}`,
				name: file.name,
				url: URL.createObjectURL(file),
				type: file.type,
			})),
			isRead: true,
		};

		// Add user message
		setMessages((prev) => [...prev, userMessage]);

		// Simulate message sending delay
		await new Promise((resolve) => setTimeout(resolve, 500));
		setIsLoading(false);

		// Simulate agent response (50% chance)
		if (Math.random() < 0.5) {
			setTimeout(
				() => {
					simulateAgentTyping();
				},
				1000 + Math.random() * 2000,
			);
		}
	};

	return (
		<div className="flex h-[600px] flex-col">
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
			<ScrollArea ref={scrollAreaRef} className="h-96 flex-1 p-4">
				<MessageList messages={messages} />

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
			</ScrollArea>

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
