"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Bold,
	Italic,
	Underline,
	List,
	ListOrdered,
	Quote,
	Code,
	AlignLeft,
	AlignCenter,
	AlignRight,
} from "lucide-react";

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	error?: string;
}

export default function RichTextEditor({
	value,
	onChange,
	placeholder = "Enter your text...",
	disabled = false,
	error,
}: RichTextEditorProps) {
	const [isActive, setIsActive] = useState(false);
	const editorRef = useRef<HTMLDivElement>(null);

	const updateContent = useCallback(() => {
		if (editorRef.current) {
			const content = editorRef.current.innerHTML;
			onChange(content);
		}
	}, [onChange]);

	const applyFormat = useCallback(
		(format: string, value?: string) => {
			if (disabled || !editorRef.current) return;

			const selection = window.getSelection();
			if (!selection || selection.rangeCount === 0) return;

			const range = selection.getRangeAt(0);

			// Check if we're inside the editor
			if (!editorRef.current.contains(range.commonAncestorContainer)) return;

			try {
				switch (format) {
					case "bold":
						document.execCommand("bold", false);
						break;
					case "italic":
						document.execCommand("italic", false);
						break;
					case "underline":
						document.execCommand("underline", false);
						break;
					case "insertUnorderedList":
						document.execCommand("insertUnorderedList", false);
						break;
					case "insertOrderedList":
						document.execCommand("insertOrderedList", false);
						break;
					case "justifyLeft":
						document.execCommand("justifyLeft", false);
						break;
					case "justifyCenter":
						document.execCommand("justifyCenter", false);
						break;
					case "justifyRight":
						document.execCommand("justifyRight", false);
						break;
					case "formatBlock":
						if (value) {
							document.execCommand("formatBlock", false, value);
						}
						break;
					default:
						break;
				}
			} catch (error) {
				console.warn("Format command failed:", error);
			}

			updateContent();
		},
		[disabled, updateContent],
	);

	const handleInput = useCallback(() => {
		updateContent();
	}, [updateContent]);

	const handlePaste = useCallback(
		(e: React.ClipboardEvent) => {
			e.preventDefault();
			const text = e.clipboardData.getData("text/plain");

			const selection = window.getSelection();
			if (!selection || selection.rangeCount === 0) return;

			const range = selection.getRangeAt(0);
			range.deleteContents();

			const textNode = document.createTextNode(text);
			range.insertNode(textNode);

			// Move cursor to end of inserted text
			range.setStartAfter(textNode);
			range.setEndAfter(textNode);
			selection.removeAllRanges();
			selection.addRange(range);

			updateContent();
		},
		[updateContent],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			// Handle keyboard shortcuts
			if (e.ctrlKey || e.metaKey) {
				switch (e.key) {
					case "b":
						e.preventDefault();
						applyFormat("bold");
						break;
					case "i":
						e.preventDefault();
						applyFormat("italic");
						break;
					case "u":
						e.preventDefault();
						applyFormat("underline");
						break;
					default:
						break;
				}
			}
		},
		[applyFormat],
	);

	const toolbarButtons = [
		{ icon: Bold, command: "bold", title: "Bold (Ctrl+B)" },
		{ icon: Italic, command: "italic", title: "Italic (Ctrl+I)" },
		{ icon: Underline, command: "underline", title: "Underline (Ctrl+U)" },
	];

	const listButtons = [
		{ icon: List, command: "insertUnorderedList", title: "Bullet List" },
		{ icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
	];

	const alignButtons = [
		{ icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
		{ icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
		{ icon: AlignRight, command: "justifyRight", title: "Align Right" },
	];

	return (
		<div
			className={`rounded-lg border ${error ? "border-red-500" : "border-gray-200"} ${
				disabled ? "opacity-50" : ""
			} ${isActive ? "ring-opacity-50 ring-2 ring-blue-500" : ""}`}
		>
			{/* Toolbar */}
			<div className="flex items-center gap-1 border-b bg-gray-50 p-2">
				{/* Text Formatting */}
				{toolbarButtons.map((button, index) => (
					<Button
						key={index}
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => applyFormat(button.command)}
						disabled={disabled}
						title={button.title}
						className="h-8 w-8 p-0 hover:bg-gray-200"
					>
						<button.icon className="h-4 w-4" />
					</Button>
				))}

				<Separator orientation="vertical" className="mx-1 h-6" />

				{/* Lists */}
				{listButtons.map((button, index) => (
					<Button
						key={index}
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => applyFormat(button.command)}
						disabled={disabled}
						title={button.title}
						className="h-8 w-8 p-0 hover:bg-gray-200"
					>
						<button.icon className="h-4 w-4" />
					</Button>
				))}

				<Separator orientation="vertical" className="mx-1 h-6" />

				{/* Alignment */}
				{alignButtons.map((button, index) => (
					<Button
						key={index}
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => applyFormat(button.command)}
						disabled={disabled}
						title={button.title}
						className="h-8 w-8 p-0 hover:bg-gray-200"
					>
						<button.icon className="h-4 w-4" />
					</Button>
				))}

				<Separator orientation="vertical" className="mx-1 h-6" />

				{/* Special Formatting */}
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => applyFormat("formatBlock", "blockquote")}
					disabled={disabled}
					title="Quote"
					className="h-8 w-8 p-0 hover:bg-gray-200"
				>
					<Quote className="h-4 w-4" />
				</Button>

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => applyFormat("formatBlock", "pre")}
					disabled={disabled}
					title="Code Block"
					className="h-8 w-8 p-0 hover:bg-gray-200"
				>
					<Code className="h-4 w-4" />
				</Button>
			</div>

			{/* Editor */}
			<div
				ref={editorRef}
				contentEditable={!disabled}
				onInput={handleInput}
				onPaste={handlePaste}
				onKeyDown={handleKeyDown}
				onFocus={() => setIsActive(true)}
				onBlur={() => setIsActive(false)}
				className="max-h-64 min-h-32 overflow-y-auto p-4 outline-none focus:ring-0"
				style={{
					whiteSpace: "pre-wrap",
					wordBreak: "break-word",
				}}
				dangerouslySetInnerHTML={{ __html: value }}
				data-placeholder={placeholder}
				suppressContentEditableWarning={true}
			/>

			{/* Error message */}
			{error && (
				<div className="border-t bg-red-50 px-4 py-2">
					<p className="text-sm text-red-600">{error}</p>
				</div>
			)}

			{/* Placeholder styling */}
			<style jsx>{`
				[contenteditable]:empty:before {
					content: attr(data-placeholder);
					color: #9ca3af;
					pointer-events: none;
					position: absolute;
				}
				[contenteditable] {
					position: relative;
				}
			`}</style>
		</div>
	);
}
