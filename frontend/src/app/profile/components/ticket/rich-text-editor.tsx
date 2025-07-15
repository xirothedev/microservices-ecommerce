"use client";

import type React from "react";

import { useState, useRef } from "react";
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

	const formatText = (command: string, value?: string) => {
		if (disabled) return;

		document.execCommand(command, false, value);
		updateContent();
	};

	const updateContent = () => {
		if (editorRef.current) {
			const content = editorRef.current.innerHTML;
			onChange(content);
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const text = e.clipboardData.getData("text/plain");
		document.execCommand("insertText", false, text);
		updateContent();
	};

	const toolbarButtons = [
		{ icon: Bold, command: "bold", title: "Bold" },
		{ icon: Italic, command: "italic", title: "Italic" },
		{ icon: Underline, command: "underline", title: "Underline" },
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
			className={`rounded-lg border ${error ? "border-red-500" : "border-gray-200"} ${disabled ? "opacity-50" : ""}`}
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
						onClick={() => formatText(button.command)}
						disabled={disabled}
						title={button.title}
						className="h-8 w-8 p-0"
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
						onClick={() => formatText(button.command)}
						disabled={disabled}
						title={button.title}
						className="h-8 w-8 p-0"
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
						onClick={() => formatText(button.command)}
						disabled={disabled}
						title={button.title}
						className="h-8 w-8 p-0"
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
					onClick={() => formatText("formatBlock", "blockquote")}
					disabled={disabled}
					title="Quote"
					className="h-8 w-8 p-0"
				>
					<Quote className="h-4 w-4" />
				</Button>

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => formatText("formatBlock", "pre")}
					disabled={disabled}
					title="Code Block"
					className="h-8 w-8 p-0"
				>
					<Code className="h-4 w-4" />
				</Button>
			</div>

			{/* Editor */}
			<div
				ref={editorRef}
				contentEditable={!disabled}
				onInput={updateContent}
				onPaste={handlePaste}
				onFocus={() => setIsActive(true)}
				onBlur={() => setIsActive(false)}
				className={`max-h-64 min-h-32 overflow-y-auto p-4 outline-none ${
					isActive ? "ring-opacity-50 ring-2 ring-blue-500" : ""
				}`}
				style={{ whiteSpace: "pre-wrap" }}
				dangerouslySetInnerHTML={{ __html: value }}
				data-placeholder={placeholder}
			/>

			{/* Placeholder styling */}
			<style jsx>{`
				[contenteditable]:empty:before {
					content: attr(data-placeholder);
					color: #9ca3af;
					pointer-events: none;
				}
			`}</style>
		</div>
	);
}
