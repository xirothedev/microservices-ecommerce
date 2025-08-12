"use client";

import { LiveChatContext } from "@/app/template";
import { cn } from "@/lib/utils";
import { MessageCircle, Paperclip, Send, Smile, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { sendChatMessage, getChatStatus, type ChatMessage } from "@/lib/api/chat";

interface Message {
	id: string;
	content: string;
	sender: "user" | "agent";
	timestamp: Date;
}

const initialMessages: Message[] = [
	{
		id: "1",
		content: "👋 Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
		sender: "agent",
		timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
	},
];

const autoResponses: { [key: string]: string } = {
	pricing:
		"Gói cước của chúng tôi bắt đầu từ $29/tháng cho gói Starter. Bạn có muốn tôi kể thêm về các gói khác nhau không?",
	features:
		"Nền tảng của chúng tôi cung cấp phân tích, quản lý máy chủ, tính năng bảo mật và nhiều hơn nữa. Bạn quan tâm đến tính năng cụ thể nào?",
	support:
		"Chúng tôi cung cấp hỗ trợ 24/7 qua chat, email và điện thoại cho gói Professional và Enterprise. Gói Starter bao gồm hỗ trợ email trong giờ làm việc.",
	trial: "Có! Chúng tôi cung cấp dùng thử miễn phí 14 ngày không cần thẻ tín dụng. Bạn sẽ có quyền truy cập đầy đủ vào tất cả tính năng trong thời gian dùng thử.",
	demo: "Tôi rất vui được sắp xếp demo cho bạn! Bạn có thể cung cấp địa chỉ email để đội ngũ của chúng tôi liên hệ không?",
	default:
		"Cảm ơn tin nhắn của bạn. Một trong những nhân viên hỗ trợ sẽ phản hồi sớm. Trong khi chờ đợi, có gì khác tôi có thể giúp bạn không?",
};

export function LiveChatWidget() {
	const { isOpen, setIsOpen } = useContext(LiveChatContext);
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [inputValue, setInputValue] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
	const [isAiEnabled, setIsAiEnabled] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: need for UX
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	// Check if AI is enabled on component mount
	useEffect(() => {
		const checkAiStatus = async () => {
			try {
				const status = await getChatStatus();
				setIsAiEnabled(status.aiEnabled);
			} catch (error) {
				console.error("Failed to check AI status:", error);
				setIsAiEnabled(false);
			}
		};

		checkAiStatus();
	}, []);

	// Generate fallback response using the original logic
	const generateFallbackResponse = (userInput: string): string => {
		const lowercaseInput = userInput.toLowerCase();

		if (lowercaseInput.includes("pricing") || lowercaseInput.includes("cost") || lowercaseInput.includes("price")) {
			return autoResponses.pricing;
		} else if (
			lowercaseInput.includes("feature") ||
			lowercaseInput.includes("offer") ||
			lowercaseInput.includes("provide")
		) {
			return autoResponses.features;
		} else if (
			lowercaseInput.includes("support") ||
			lowercaseInput.includes("help") ||
			lowercaseInput.includes("assistance")
		) {
			return autoResponses.support;
		} else if (
			lowercaseInput.includes("trial") ||
			lowercaseInput.includes("free") ||
			lowercaseInput.includes("try")
		) {
			return autoResponses.trial;
		} else if (
			lowercaseInput.includes("demo") ||
			lowercaseInput.includes("demonstration") ||
			lowercaseInput.includes("show")
		) {
			return autoResponses.demo;
		}

		return autoResponses.default;
	};

	const handleSendMessage = async () => {
		if (!inputValue.trim()) return;

		const currentInput = inputValue;

		// Add user message
		const userMessage: Message = {
			id: Date.now().toString(),
			content: currentInput,
			sender: "user",
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");

		// Update conversation history for Gemini
		const newUserMessage: ChatMessage = {
			role: "user",
			content: currentInput,
		};
		const updatedHistory = [...conversationHistory, newUserMessage];
		setConversationHistory(updatedHistory);

		// Show typing indicator
		setIsTyping(true);

		try {
			let responseContent: string;

			// Send message to backend API
			const response = await sendChatMessage(currentInput, updatedHistory);

			if (response.error) {
				console.warn("Backend API failed, falling back to auto-responses:", response.error);
				responseContent = generateFallbackResponse(currentInput);
			} else {
				responseContent = response.content;
			}

			// Add agent response
			const agentMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: responseContent,
				sender: "agent",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, agentMessage]);

			// Update conversation history with agent response
			const newAgentMessage: ChatMessage = {
				role: "assistant",
				content: responseContent,
			};
			setConversationHistory((prev) => [...prev, newAgentMessage]);
		} catch (error) {
			console.error("Error generating response:", error);

			// Fallback to auto-responses on any error
			const fallbackResponse = generateFallbackResponse(currentInput);
			const agentMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: fallbackResponse,
				sender: "agent",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, agentMessage]);
		} finally {
			setIsTyping(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	return (
		<>
			{/* Chat Button */}
			<div className="fixed right-4 bottom-4 z-50">
				<Button
					onClick={() => setIsOpen(!isOpen)}
					className="h-14 w-14 rounded-full shadow-lg"
					aria-label={isOpen ? "Đóng chat" : "Mở chat"}
				>
					{isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
				</Button>
			</div>

			{/* Chat Window */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className="bg-card fixed right-4 bottom-20 z-50 flex w-[350px] flex-col rounded-lg border shadow-xl sm:w-[400px]"
						style={{ maxHeight: "calc(100vh - 100px)" }}
					>
						{/* Chat Header */}
						<div className="flex items-center justify-between border-b p-4">
							<div className="flex items-center gap-3">
								<Avatar>
									<AvatarImage src="/placeholder.svg?height=40&width=40" alt="Nhân viên hỗ trợ" />
									<AvatarFallback>NH</AvatarFallback>
								</Avatar>
								<div>
									<div className="font-medium">Đội ngũ hỗ trợ</div>
									<div className="text-muted-foreground text-xs">
										{isAiEnabled ? "Hỗ trợ AI" : "Tự động phản hồi"} | Trực tuyến
									</div>
								</div>
							</div>
							<Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Đóng chat">
								<X className="h-4 w-4" />
							</Button>
						</div>

						{/* Chat Messages */}
						<div className="flex-1 space-y-4 overflow-y-auto p-4">
							{messages.map((message) => (
								<div
									key={message.id}
									className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
								>
									<div
										className={cn(
											"max-w-[80%] rounded-lg px-4 py-2",
											message.sender === "user"
												? "bg-primary text-primary-foreground"
												: "bg-muted text-foreground",
										)}
									>
										<div className="text-sm">{message.content}</div>
										<div className="mt-1 text-right text-xs opacity-70">
											{formatTime(message.timestamp)}
										</div>
									</div>
								</div>
							))}
							{isTyping && (
								<div className="flex justify-start">
									<div className="bg-muted text-foreground max-w-[80%] rounded-lg px-4 py-2">
										<div className="flex items-center gap-1">
											<div className="bg-foreground/70 h-2 w-2 animate-bounce rounded-full" />
											<div
												className="bg-foreground/70 h-2 w-2 animate-bounce rounded-full"
												style={{ animationDelay: "0.2s" }}
											/>
											<div
												className="bg-foreground/70 h-2 w-2 animate-bounce rounded-full"
												style={{ animationDelay: "0.4s" }}
											/>
										</div>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Chat Input */}
						<div className="border-t p-4">
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="icon" aria-label="Đính kèm tệp">
									<Paperclip className="h-4 w-4" />
								</Button>
								<Input
									ref={inputRef}
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Nhập tin nhắn của bạn..."
									className="flex-1"
								/>
								<Button variant="ghost" size="icon" aria-label="Chèn emoji">
									<Smile className="h-4 w-4" />
								</Button>
								<Button
									onClick={handleSendMessage}
									disabled={!inputValue.trim()}
									aria-label="Gửi tin nhắn"
								>
									<Send className="h-4 w-4" />
								</Button>
							</div>
							<div className="text-muted-foreground mt-2 text-center text-xs">
								Được hỗ trợ bởi Terminal Support
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
