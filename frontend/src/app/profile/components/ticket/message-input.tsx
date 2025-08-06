"use client";

import { useState, useRef, useEffect, useCallback, ChangeEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, ImageIcon, X, Loader2, Smile, Bold, Italic } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MessageInputProps {
	onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
	onTyping: () => void;
	disabled?: boolean;
	isLoading?: boolean;
}

export default function MessageInput({
	onSendMessage,
	disabled = false,
	isLoading = false,
	onTyping,
}: MessageInputProps) {
	const [message, setMessage] = useState("");
	const [attachments, setAttachments] = useState<File[]>([]);
	const [isDragOver, setIsDragOver] = useState(false);
	const dragCounterRef = useRef(0);
	const [shouldFocusAfterSend, setShouldFocusAfterSend] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Debounced typing function
	const debouncedTyping = useCallback(() => {
		// Clear existing timeout
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// Set new timeout
		typingTimeoutRef.current = setTimeout(() => {
			onTyping();
		}, 500); // 500ms debounce
	}, [onTyping]);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, []);

	// Focus textarea when loading finishes after sending
	useEffect(() => {
		if (!isLoading && shouldFocusAfterSend && textareaRef.current) {
			textareaRef.current.focus();
			setShouldFocusAfterSend(false);
		}
	}, [isLoading, shouldFocusAfterSend]);

	// Handle paste events for clipboard images (screenshots)
	const handlePaste = async (e: React.ClipboardEvent) => {
		const items = e.clipboardData?.items;
		if (!items) return;

		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			// Check if the item is an image
			if (item.type.startsWith("image/")) {
				e.preventDefault();

				const file = item.getAsFile();
				if (file) {
					// Check file size and attachment limit
					if (file.size > maxFileSize) {
						alert(`Image too large (max ${Math.round(maxFileSize / 1024 / 1024)}MB)`);
						return;
					}

					if (attachments.length >= maxFiles) {
						alert(`Maximum ${maxFiles} files allowed`);
						return;
					}

					// Create a new file with a proper name
					const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
					const newFile = new File([file], `screenshot-${timestamp}.png`, {
						type: file.type,
						lastModified: Date.now(),
					});

					setAttachments((prev) => [...prev, newFile]);
				}
				break; // Only handle the first image found
			}
		}
	};

	const maxFiles = 3;
	const maxFileSize = 5 * 1024 * 1024; // 5MB
	const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "text/plain"];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if ((!message.trim() && attachments.length === 0) || disabled || isLoading) {
			return;
		}

		try {
			setShouldFocusAfterSend(true);
			await onSendMessage(message.trim(), attachments);
			setMessage("");
			setAttachments([]);

			// Reset textarea height
			if (textareaRef.current) {
				textareaRef.current.style.height = "auto";
			}
		} catch (error) {
			console.error("Failed to send message:", error);
			setShouldFocusAfterSend(false);
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const handleFileSelect = (files: FileList) => {
		const validFiles: File[] = [];
		const errors: string[] = [];

		Array.from(files).forEach((file) => {
			if (attachments.length + validFiles.length >= maxFiles) {
				errors.push(`Maximum ${maxFiles} files allowed`);
				return;
			}

			if (!acceptedTypes.includes(file.type)) {
				errors.push(`${file.name}: Invalid file type`);
				return;
			}

			if (file.size > maxFileSize) {
				errors.push(`${file.name}: File too large (max 5MB)`);
				return;
			}

			validFiles.push(file);
		});

		if (errors.length > 0) {
			alert(errors.join("\n"));
		}

		if (validFiles.length > 0) {
			setAttachments((prev) => [...prev, ...validFiles]);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounterRef.current = 0;
		setIsDragOver(false);

		if (e.dataTransfer.files.length > 0) {
			handleFileSelect(e.dataTransfer.files);
		}
	};

	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounterRef.current++;
		if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
			setIsDragOver(true);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounterRef.current--;
		if (dragCounterRef.current === 0) {
			setIsDragOver(false);
		}
	};

	const removeAttachment = (index: number) => {
		setAttachments((prev) => prev.filter((_, i) => i !== index));
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const getFileIcon = (file: File) => {
		if (file.type.startsWith("image/")) {
			return <ImageIcon className="h-3 w-3" />;
		}
		return <Paperclip className="h-3 w-3" />;
	};

	// Auto-resize textarea
	const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);

		// Trigger typing indicator when user is actually typing
		if (e.target.value.length > 0) {
			debouncedTyping();
		}

		// Auto-resize
		const textarea = e.target;
		textarea.style.height = "auto";
		textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
	};

	return (
		<div className="space-y-3">
			{/* Attachments Preview */}
			<AnimatePresence>
				{attachments.length > 0 && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="flex flex-wrap gap-2"
					>
						{attachments.map((file, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2"
							>
								<div className="text-gray-600">{getFileIcon(file)}</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
									<p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => removeAttachment(index)}
									className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
									disabled={disabled || isLoading}
								>
									<X className="h-3 w-3" />
								</Button>
							</motion.div>
						))}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Message Input Area */}
			<form onSubmit={handleSubmit} className="space-y-3">
				<div
					className={`relative rounded-lg border ${
						isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-200"
					} ${disabled ? "opacity-50" : ""}`}
					onDrop={handleDrop}
					onDragEnter={handleDragEnter}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
				>
					{/* Formatting Toolbar */}
					<div className="flex items-center justify-between border-b bg-gray-50 p-2">
						<div className="flex items-center gap-1">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="h-7 w-7 p-0"
								disabled={disabled || isLoading}
								title="Bold"
							>
								<Bold className="h-3 w-3" />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="h-7 w-7 p-0"
								disabled={disabled || isLoading}
								title="Italic"
							>
								<Italic className="h-3 w-3" />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="h-7 w-7 p-0"
								disabled={disabled || isLoading}
								title="Emoji"
							>
								<Smile className="h-3 w-3" />
							</Button>
						</div>

						<div className="flex items-center gap-1">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => fileInputRef.current?.click()}
								disabled={disabled || isLoading || attachments.length >= maxFiles}
								className="h-7 px-2 text-xs"
								title="Attach files"
							>
								<Paperclip className="mr-1 h-3 w-3" />
								Attach
							</Button>
							<Badge variant="secondary" className="text-xs">
								{attachments.length}/{maxFiles}
							</Badge>
						</div>
					</div>

					{/* Text Input */}
					<div className="relative">
						<Textarea
							ref={textareaRef}
							value={message}
							onChange={handleTextareaChange}
							onKeyDown={handleKeyDown}
							onPaste={handlePaste}
							placeholder={
								disabled
									? "Reconnecting..."
									: "Type your message... (Press Enter to send, Shift+Enter for new line)"
							}
							disabled={disabled || isLoading}
							className="max-h-[120px] min-h-[60px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
							style={{ height: "auto" }}
						/>

						{/* Drag Overlay */}
						{isDragOver && (
							<div className="bg-opacity-90 pointer-events-none absolute inset-0 flex items-center justify-center rounded border-2 border-dashed border-blue-500 bg-blue-50">
								<div className="text-center">
									<Paperclip className="mx-auto mb-2 h-8 w-8 text-blue-500" />
									<p className="text-sm font-medium text-blue-700">Drop files here to attach</p>
								</div>
							</div>
						)}
					</div>

					{/* Send Button */}
					<div className="flex items-center justify-between border-t bg-gray-50 p-2">
						<div className="text-xs text-gray-500">
							{message.length > 0 && `${message.length} characters`}
						</div>
						<Button
							type="submit"
							size="sm"
							disabled={(!message.trim() && attachments.length === 0) || disabled || isLoading}
							className="flex items-center gap-2"
						>
							{isLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Sending...
								</>
							) : (
								<>
									<Send className="h-4 w-4" />
									Send
								</>
							)}
						</Button>
					</div>
				</div>

				{/* File Input */}
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept={acceptedTypes.join(",")}
					onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
					className="hidden"
					disabled={disabled || isLoading}
				/>
			</form>

			{/* Helper Text */}
			<div className="text-center text-xs text-gray-500">
				You can attach up to {maxFiles} files (images, PDFs, text files) • Max 5MB each
			</div>
		</div>
	);
}
