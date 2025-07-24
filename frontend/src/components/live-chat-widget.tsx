"use client";

import { LiveChatContext } from "@/app/template";
import { cn } from "@/lib/utils";
import { MessageCircle, Paperclip, Send, Smile, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Message {
	id: string;
	content: string;
	sender: "user" | "agent";
	timestamp: Date;
}

const initialMessages: Message[] = [
	{
		id: "1",
		content: "👋 Hi there! How can I help you today?",
		sender: "agent",
		timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
	},
];

const autoResponses: { [key: string]: string } = {
	pricing:
		"Our pricing plans start at $29/month for the Starter plan. Would you like me to tell you more about our different plans?",
	features:
		"Our platform offers analytics, server management, security features, and much more. What specific features are you interested in?",
	support:
		"We offer 24/7 support via chat, email, and phone for our Professional and Enterprise plans. Starter plan includes email support during business hours.",
	trial: "Yes! We offer a 14-day free trial with no credit card required. You'll get full access to all features during the trial period.",
	demo: "I'd be happy to arrange a demo for you! Could you please provide your email address so our team can contact you?",
	default:
		"Thank you for your message. One of our support agents will respond shortly. In the meantime, is there anything else I can help you with?",
};

export function LiveChatWidget() {
	const { isOpen, setIsOpen } = useContext(LiveChatContext);
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [inputValue, setInputValue] = useState("");
	const [isTyping, setIsTyping] = useState(false);
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

	const handleSendMessage = () => {
		if (!inputValue.trim()) return;

		// Add user message
		const userMessage: Message = {
			id: Date.now().toString(),
			content: inputValue,
			sender: "user",
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");

		// Simulate agent typing
		setIsTyping(true);
		setTimeout(() => {
			setIsTyping(false);

			// Generate auto-response based on keywords
			let responseContent = autoResponses.default;
			const lowercaseInput = inputValue.toLowerCase();

			if (
				lowercaseInput.includes("pricing") ||
				lowercaseInput.includes("cost") ||
				lowercaseInput.includes("price")
			) {
				responseContent = autoResponses.pricing;
			} else if (
				lowercaseInput.includes("feature") ||
				lowercaseInput.includes("offer") ||
				lowercaseInput.includes("provide")
			) {
				responseContent = autoResponses.features;
			} else if (
				lowercaseInput.includes("support") ||
				lowercaseInput.includes("help") ||
				lowercaseInput.includes("assistance")
			) {
				responseContent = autoResponses.support;
			} else if (
				lowercaseInput.includes("trial") ||
				lowercaseInput.includes("free") ||
				lowercaseInput.includes("try")
			) {
				responseContent = autoResponses.trial;
			} else if (
				lowercaseInput.includes("demo") ||
				lowercaseInput.includes("demonstration") ||
				lowercaseInput.includes("show")
			) {
				responseContent = autoResponses.demo;
			}

			// Add agent response
			const agentMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: responseContent,
				sender: "agent",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, agentMessage]);
		}, 1500); // Simulate typing delay
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
					aria-label={isOpen ? "Close chat" : "Open chat"}
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
									<AvatarImage src="/placeholder.svg?height=40&width=40" alt="Support Agent" />
									<AvatarFallback>SA</AvatarFallback>
								</Avatar>
								<div>
									<div className="font-medium">Support Team</div>
									<div className="text-muted-foreground text-xs">
										Online | Typically replies in minutes
									</div>
								</div>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsOpen(false)}
								aria-label="Close chat"
							>
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
								<Button variant="ghost" size="icon" aria-label="Attach file">
									<Paperclip className="h-4 w-4" />
								</Button>
								<Input
									ref={inputRef}
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Type your message..."
									className="flex-1"
								/>
								<Button variant="ghost" size="icon" aria-label="Insert emoji">
									<Smile className="h-4 w-4" />
								</Button>
								<Button
									onClick={handleSendMessage}
									disabled={!inputValue.trim()}
									aria-label="Send message"
								>
									<Send className="h-4 w-4" />
								</Button>
							</div>
							<div className="text-muted-foreground mt-2 text-center text-xs">
								Powered by Terminal Support
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
