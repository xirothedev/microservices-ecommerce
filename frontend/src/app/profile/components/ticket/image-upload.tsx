"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios";
import { Upload, X, ImageIcon, FileText, AlertCircle, CheckCircle } from "lucide-react";
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
	uploadedUrl?: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

export default function ImageUpload({ images, onImagesChange, disabled = false, error }: ImageUploadProps) {
	const [isDragOver, setIsDragOver] = useState(false);
	const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const uploadFile = async (file: File, onProgress: (progress: number) => void): Promise<string> => {
		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await axiosInstance.postForm("/upload", formData, {
				onUploadProgress: (progressEvent) => {
					if (progressEvent.total) {
						const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
						onProgress(progress);
					}
				},
			});

			return response.data.url || response.data.data?.url;
		} catch (error) {
			console.error("Upload failed:", error);
			throw new Error("Upload failed");
		}
	};

	const handleFiles = useCallback(
		async (fileList: FileList) => {
			if (disabled) return;

			const newFiles = Array.from(fileList);
			const currentTotal = images.length + newFiles.length;

			if (currentTotal > MAX_FILES) {
				toast({
					title: "Too many files",
					description: `You can only upload up to ${MAX_FILES} files total.`,
					variant: "destructive",
				});
				return;
			}

			// Validate files
			const validFiles: File[] = [];
			const errors: string[] = [];

			const validateFile = (file: File): string | null => {
				if (!ACCEPTED_TYPES.includes(file.type)) {
					return `${file.name}: Invalid file type. Please upload images or PDF files.`;
				}
				if (file.size > MAX_SIZE) {
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
				toast({
					title: "Invalid files",
					description: errors.join(", "),
					variant: "destructive",
				});
			}

			if (validFiles.length === 0) return;

			// Start upload
			const uploadingFiles: UploadingFile[] = validFiles.map((file) => ({
				file,
				progress: 0,
				status: "uploading" as const,
			}));

			setUploadingFiles(uploadingFiles);

			// Upload each file
			const uploadPromises = uploadingFiles.map(async (uploadingFile) => {
				try {
					const uploadedUrl = await uploadFile(uploadingFile.file, (progress) => {
						setUploadingFiles((prev) =>
							prev.map((f) => (f.file === uploadingFile.file ? { ...f, progress } : f)),
						);
					});

					setUploadingFiles((prev) =>
						prev.map((f) =>
							f.file === uploadingFile.file ? { ...f, status: "success" as const, uploadedUrl } : f,
						),
					);

					return uploadingFile.file;
				} catch {
					setUploadingFiles((prev) =>
						prev.map((f) => (f.file === uploadingFile.file ? { ...f, status: "error" as const } : f)),
					);

					toast({
						title: "Upload failed",
						description: `Failed to upload ${uploadingFile.file.name}`,
						variant: "destructive",
					});

					return null;
				}
			});

			try {
				const results = await Promise.all(uploadPromises);
				const successfulFiles = results.filter((file): file is File => file !== null);

				if (successfulFiles.length > 0) {
					onImagesChange([...images, ...successfulFiles]);

					toast({
						title: "Upload successful",
						description: `${successfulFiles.length} file(s) uploaded successfully`,
						variant: "default",
					});
				}

				// Clear uploading files after a delay
				setTimeout(() => {
					setUploadingFiles([]);
				}, 2000);
			} catch (error) {
				console.error("Upload error:", error);
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
				className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
					isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
				} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-gray-400"} ${
					error ? "border-red-500" : ""
				}`}
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

			{/* Error message */}
			{error && (
				<div className="rounded-lg border border-red-200 bg-red-50 p-3">
					<p className="text-sm text-red-600">{error}</p>
				</div>
			)}

			{/* Uploading Files */}
			<AnimatePresence>
				{uploadingFiles.map((uploadingFile, index) => (
					<motion.div
						key={`uploading-${uploadingFile.file.name}-${index}`}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
					>
						<div className="flex-shrink-0">
							{uploadingFile.status === "error" ? (
								<AlertCircle className="h-5 w-5 text-red-500" />
							) : uploadingFile.status === "success" ? (
								<CheckCircle className="h-5 w-5 text-green-500" />
							) : (
								getFileIcon(uploadingFile.file)
							)}
						</div>
						<div className="min-w-0 flex-1">
							<div className="mb-1 flex items-center justify-between">
								<p className="truncate text-sm font-medium text-gray-900">{uploadingFile.file.name}</p>
								<Badge
									variant={
										uploadingFile.status === "success"
											? "default"
											: uploadingFile.status === "error"
												? "destructive"
												: "secondary"
									}
								>
									{uploadingFile.status === "uploading" && `${Math.round(uploadingFile.progress)}%`}
									{uploadingFile.status === "success" && "Uploaded"}
									{uploadingFile.status === "error" && "Failed"}
								</Badge>
							</div>
							<div className="flex items-center gap-2">
								<Progress
									value={uploadingFile.progress}
									className={`h-1 flex-1 ${uploadingFile.status === "error" ? "bg-red-100" : ""}`}
								/>
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
						key={`uploaded-${file.name}-${index}`}
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
