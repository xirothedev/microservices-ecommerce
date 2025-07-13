"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, X, ImageIcon, FileText, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ImageUploadProps {
	images: File[];
	onImagesChange: (images: File[]) => void;
	disabled?: boolean;
	error?: string;
}

interface UploadingFile {
	file: File;
	progress: number;
	status: "uploading" | "success" | "error";
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
// const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

export default function ImageUpload({ images, onImagesChange, disabled = false, error }: ImageUploadProps) {
	const [isDragOver, setIsDragOver] = useState(false);
	const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const simulateUpload = async (file: File): Promise<void> => {
		return new Promise((resolve) => {
			let progress = 0;
			const interval = setInterval(() => {
				progress += Math.random() * 30;
				if (progress >= 100) {
					progress = 100;
					clearInterval(interval);
					resolve();
				}

				setUploadingFiles((prev) =>
					prev.map((f) => (f.file === file ? { ...f, progress: Math.min(progress, 100) } : f)),
				);
			}, 200);
		});
	};

	const handleFiles = useCallback(
		async (fileList: FileList) => {
			if (disabled) return;

			const newFiles = Array.from(fileList);
			const currentTotal = images.length + newFiles.length;

			if (currentTotal > MAX_FILES) {
				alert(`You can only upload up to ${MAX_FILES} files total.`);
				return;
			}

			// Validate files
			const validFiles: File[] = [];
			const errors: string[] = [];

			const validateFile = (file: File): string | null => {
				if (!ACCEPTED_TYPES.includes(file.type)) {
					return `${file.name}: Invalid file type. Please upload images or PDF files.`;
				}
				if (file.size > MAX_FILES) {
					return `${file.name}: File too large. Maximum size is 5MB.`;
				}
				return null;
			};

			for (const file of newFiles) {
				const error = validateFile(file);
				if (error) {
					errors.push(error);
				} else {
					validFiles.push(file);
				}
			}

			if (errors.length > 0) {
				alert(errors.join("\n"));
			}

			if (validFiles.length === 0) return;

			// Start upload simulation
			const uploadingFiles: UploadingFile[] = validFiles.map((file) => ({
				file,
				progress: 0,
				status: "uploading" as const,
			}));

			setUploadingFiles(uploadingFiles);

			// Simulate upload for each file
			try {
				for (const uploadingFile of uploadingFiles) {
					await simulateUpload(uploadingFile.file);
					setUploadingFiles((prev) =>
						prev.map((f) => (f.file === uploadingFile.file ? { ...f, status: "success" as const } : f)),
					);
				}

				// Add to final images list
				onImagesChange([...images, ...validFiles]);

				// Clear uploading files after a delay
				setTimeout(() => {
					setUploadingFiles([]);
				}, 1000);
			} catch {
				setUploadingFiles((prev) => prev.map((f) => ({ ...f, status: "error" as const })));
			}
		},
		[images, disabled, onImagesChange],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);

			if (e.dataTransfer.files.length > 0) {
				handleFiles(e.dataTransfer.files);
			}
		},
		[handleFiles],
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const removeImage = (index: number) => {
		if (disabled) return;
		const newImages = images.filter((_, i) => i !== index);
		onImagesChange(newImages);
	};

	const getFileIcon = (file: File) => {
		if (file.type.startsWith("image/")) {
			return <ImageIcon className="h-4 w-4" />;
		}
		return <FileText className="h-4 w-4" />;
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	return (
		<div className="space-y-4">
			{/* Upload Area */}
			<div
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-gray-400"} ${error ? "border-red-500" : ""} `}
				onClick={() => !disabled && fileInputRef.current?.click()}
			>
				<Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
				<p className="mb-1 text-sm text-gray-600">
					<span className="font-medium">Click to upload</span> or drag and drop
				</p>
				<p className="text-xs text-gray-500">
					PNG, JPG, GIF, WebP or PDF up to 5MB each (max {MAX_FILES} files)
				</p>

				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept={ACCEPTED_TYPES.join(",")}
					onChange={(e) => e.target.files && handleFiles(e.target.files)}
					className="hidden"
					disabled={disabled}
				/>
			</div>

			{/* Uploading Files */}
			<AnimatePresence>
				{uploadingFiles.map((uploadingFile, index) => (
					<motion.div
						key={`uploading-${index}`}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
					>
						<div className="flex-shrink-0">
							{uploadingFile.status === "error" ? (
								<AlertCircle className="h-5 w-5 text-red-500" />
							) : (
								getFileIcon(uploadingFile.file)
							)}
						</div>
						<div className="min-w-0 flex-1">
							<div className="mb-1 flex items-center justify-between">
								<p className="truncate text-sm font-medium text-gray-900">{uploadingFile.file.name}</p>
								<Badge variant={uploadingFile.status === "success" ? "default" : "secondary"}>
									{uploadingFile.status === "uploading" && `${Math.round(uploadingFile.progress)}%`}
									{uploadingFile.status === "success" && "Uploaded"}
									{uploadingFile.status === "error" && "Failed"}
								</Badge>
							</div>
							<div className="flex items-center gap-2">
								<Progress value={uploadingFile.progress} className="h-1 flex-1" />
								<span className="text-xs text-gray-500">{formatFileSize(uploadingFile.file.size)}</span>
							</div>
						</div>
					</motion.div>
				))}
			</AnimatePresence>

			{/* Uploaded Files */}
			<AnimatePresence>
				{images.map((file, index) => (
					<motion.div
						key={`uploaded-${index}`}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3"
					>
						<div className="flex-shrink-0 text-green-600">{getFileIcon(file)}</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
							<p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
						</div>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => removeImage(index)}
							disabled={disabled}
							className="h-8 w-8 flex-shrink-0 p-0 text-gray-400 hover:text-red-500"
						>
							<X className="h-4 w-4" />
						</Button>
					</motion.div>
				))}
			</AnimatePresence>

			{/* File Count Info */}
			{images.length > 0 && (
				<div className="text-center text-xs text-gray-500">
					{images.length} of {MAX_FILES} files uploaded
				</div>
			)}
		</div>
	);
}
