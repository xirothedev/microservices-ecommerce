"use client";

import { useState, useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link, ImageIcon, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
	const [isPreview, setIsPreview] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const insertText = (before: string, after = "") => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = value.substring(start, end);
		const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

		onChange(newText);

		// Restore cursor position
		setTimeout(() => {
			textarea.focus();
			textarea.setSelectionRange(start + before.length, end + before.length);
		}, 0);
	};

	const formatButtons = [
		{ icon: Bold, action: () => insertText("<strong>", "</strong>"), title: "Bold" },
		{ icon: Italic, action: () => insertText("<em>", "</em>"), title: "Italic" },
		{ icon: Underline, action: () => insertText("<u>", "</u>"), title: "Underline" },
		{ icon: List, action: () => insertText("<ul><li>", "</li></ul>"), title: "Bullet List" },
		{ icon: ListOrdered, action: () => insertText("<ol><li>", "</li></ol>"), title: "Numbered List" },
		{ icon: Link, action: () => insertText('<a href="">', "</a>"), title: "Link" },
		{ icon: Code, action: () => insertText("<code>", "</code>"), title: "Code" },
		{
			icon: ImageIcon,
			action: () =>
				insertText(
					'<img src="https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"> alt="">',
				),
			title: "Image",
		},
	];

	// const stripHtml = (html: string) => {
	// 	return html.replace(/<[^>]*>/g, "");
	// };

	return (
		<div className="overflow-hidden rounded-lg border">
			<div className="flex items-center justify-between border-b bg-gray-50 p-2">
				<div className="flex items-center gap-1">
					{formatButtons.map((button, index) => (
						<Button
							key={index}
							variant="ghost"
							size="sm"
							onClick={button.action}
							title={button.title}
							type="button"
						>
							<button.icon className="h-4 w-4" />
						</Button>
					))}
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant={!isPreview ? "default" : "ghost"}
						size="sm"
						onClick={() => setIsPreview(false)}
						type="button"
					>
						Edit
					</Button>
					<Button
						variant={isPreview ? "default" : "ghost"}
						size="sm"
						onClick={() => setIsPreview(true)}
						type="button"
					>
						Preview
					</Button>
				</div>
			</div>

			<div className="min-h-[200px]">
				{isPreview ? (
					<div className="prose max-w-none p-4" dangerouslySetInnerHTML={{ __html: value }} />
				) : (
					<Textarea
						ref={textareaRef}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder}
						className="min-h-[200px] resize-none border-0 focus:ring-0"
					/>
				)}
			</div>
		</div>
	);
}
