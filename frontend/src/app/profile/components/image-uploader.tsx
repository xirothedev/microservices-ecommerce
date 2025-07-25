"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, X, ImageIcon, FileText, AlertCircle, Crop } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ImageCropModal from "./image-crop-modal";

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

interface CropModalState {
	isOpen: boolean;
	imageSrc: string;
	fileName: string;
	originalFile: File | null;
}

export default function ImageUpload({ images, onImagesChange, disabled = false, error }: ImageUploadProps) {
	const [isDragOver, setIsDragOver] = useState(false);
	const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
	const [cropModal, setCropModal] = useState<CropModalState>({
		isOpen: false,
		imageSrc: "",
		fileName: "",
		originalFile: null,
	});
	const fileInputRef = useRef<HTMLInputElement>(null);

	const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
	const maxSize = 5 * 1024 * 1024; // 5MB
	const maxFiles = 5;

	const validateFile = (file: File): string | null => {
		if (!acceptedTypes.includes(file.type)) {
			return `${file.name}: Invalid file type. Please upload images or PDF files.`;
		}
		if (file.size > maxSize) {
			return `${file.name}: File too large. Maximum size is 5MB.`;
		}
		return null;
	};

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

	const openCropModal = (file: File) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target?.result) {
				setCropModal({
					isOpen: true,
					imageSrc: e.target.result as string,
					fileName: file.name,
					originalFile: file,
				});
			}
		};
		reader.readAsDataURL(file);
	};

	const handleCropComplete = (croppedImageUrl: string, croppedFile: File) => {
		if (cropModal.originalFile) {
			// Replace the original file with the cropped file
			const updatedFile = new File([croppedFile], cropModal.fileName, {
				type: croppedFile.type,
				lastModified: Date.now(),
			});

			onImagesChange([...images, updatedFile]);
		}

		setCropModal({
			isOpen: false,
			imageSrc: "",
			fileName: "",
			originalFile: null,
		});
	};

	const handleFiles = useCallback(
		async (fileList: FileList) => {
			if (disabled) return;

			const newFiles = Array.from(fileList);
			const currentTotal = images.length + newFiles.length;

			if (currentTotal > maxFiles) {
				alert(`You can only upload up to ${maxFiles} files total.`);
				return;
			}

			// Validate files
			const validFiles: File[] = [];
			const errors: string[] = [];

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

			// Check if any files are images that can be cropped
			const imageFiles = validFiles.filter((file) => file.type.startsWith("image/"));
			const nonImageFiles = validFiles.filter((file) => !file.type.startsWith("image/"));

			// Process non-image files normally
			if (nonImageFiles.length > 0) {
				const uploadingFiles: UploadingFile[] = nonImageFiles.map((file) => ({
					file,
					progress: 0,
					status: "uploading" as const,
				}));

				setUploadingFiles((prev) => [...prev, ...uploadingFiles]);

				try {
					for (const uploadingFile of uploadingFiles) {
						await simulateUpload(uploadingFile.file);
						setUploadingFiles((prev) =>
							prev.map((f) => (f.file === uploadingFile.file ? { ...f, status: "success" as const } : f)),
						);
					}

					onImagesChange([...images, ...nonImageFiles]);

					setTimeout(() => {
						setUploadingFiles((prev) => prev.filter((f) => !nonImageFiles.includes(f.file)));
					}, 1000);
				} catch {
					setUploadingFiles((prev) =>
						prev.map((f) => (nonImageFiles.includes(f.file) ? { ...f, status: "error" as const } : f)),
					);
				}
			}

			// For image files, open crop modal for the first one
			if (imageFiles.length > 0) {
				openCropModal(imageFiles[0]);

				// If there are multiple image files, add the rest without cropping
				if (imageFiles.length > 1) {
					const remainingImages = imageFiles.slice(1);
					onImagesChange([...images, ...remainingImages]);
				}
			}
		},
		[images, onImagesChange, disabled],
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

	const cropImage = (index: number) => {
		const file = images[index];
		if (file && file.type.startsWith("image/")) {
			// Remove the original file from the list
			const newImages = images.filter((_, i) => i !== index);
			onImagesChange(newImages);

			// Open crop modal
			openCropModal(file);
		}
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
				className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${isDragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-300 dark:border-gray-600"} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"} ${error ? "border-red-500" : ""} dark:bg-gray-800`}
				onClick={() => !disabled && fileInputRef.current?.click()}
			>
				<Upload className="mx-auto mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" />
				<p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
					<span className="font-medium">Click to upload</span> or drag and drop
				</p>
				<p className="text-xs text-gray-500 dark:text-gray-400">
					PNG, JPG, GIF, WebP or PDF up to 5MB each (max {maxFiles} files)
				</p>
				<p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
					Images will open crop editor automatically
				</p>

				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept={acceptedTypes.join(",")}
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
						className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
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
								<p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
									{uploadingFile.file.name}
								</p>
								<Badge variant={uploadingFile.status === "success" ? "default" : "secondary"}>
									{uploadingFile.status === "uploading" && `${Math.round(uploadingFile.progress)}%`}
									{uploadingFile.status === "success" && "Uploaded"}
									{uploadingFile.status === "error" && "Failed"}
								</Badge>
							</div>
							<div className="flex items-center gap-2">
								<Progress value={uploadingFile.progress} className="h-1 flex-1" />
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{formatFileSize(uploadingFile.file.size)}
								</span>
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
						className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20"
					>
						<div className="flex-shrink-0 text-green-600 dark:text-green-400">{getFileIcon(file)}</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
						</div>
						<div className="flex items-center gap-2">
							{file.type.startsWith("image/") && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => cropImage(index)}
									disabled={disabled}
									className="h-8 w-8 flex-shrink-0 p-0 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
									title="Crop image"
								>
									<Crop className="h-4 w-4" />
								</Button>
							)}
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => removeImage(index)}
								disabled={disabled}
								className="h-8 w-8 flex-shrink-0 p-0 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</motion.div>
				))}
			</AnimatePresence>

			{/* File Count Info */}
			{images.length > 0 && (
				<div className="text-center text-xs text-gray-500 dark:text-gray-400">
					{images.length} of {maxFiles} files uploaded
				</div>
			)}

			{/* Image Crop Modal */}
			<ImageCropModal
				isOpen={cropModal.isOpen}
				onClose={() => setCropModal((prev) => ({ ...prev, isOpen: false }))}
				imageSrc={cropModal.imageSrc}
				onCropComplete={handleCropComplete}
				fileName={cropModal.fileName}
				aspectRatio={16 / 9} // Default aspect ratio for tickets
			/>
		</div>
	);
}
