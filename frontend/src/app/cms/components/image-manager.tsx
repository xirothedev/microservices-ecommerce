"use client";

import { useState, useRef } from "react";
import { Upload, X, Plus, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface ImageManagerProps {
	images: string[];
	onChange: (images: string[]) => void;
	maxImages?: number;
}

export default function ImageManager({ images, onChange, maxImages = 10 }: ImageManagerProps) {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (files: FileList | null) => {
		if (!files) return;

		const newImages: string[] = [];
		const remainingSlots = maxImages - images.length;

		Array.from(files)
			.slice(0, remainingSlots)
			.forEach((file) => {
				if (file.type.startsWith("image/")) {
					const reader = new FileReader();
					reader.onload = (e) => {
						if (e.target?.result) {
							newImages.push(e.target.result as string);
							if (newImages.length === Math.min(files.length, remainingSlots)) {
								onChange([...images, ...newImages]);
							}
						}
					};
					reader.readAsDataURL(file);
				}
			});
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		handleFileSelect(e.dataTransfer.files);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const removeImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index);
		onChange(newImages);
	};

	// const moveImage = (fromIndex: number, toIndex: number) => {
	// 	const newImages = [...images];
	// 	const [movedImage] = newImages.splice(fromIndex, 1);
	// 	newImages.splice(toIndex, 0, movedImage);
	// 	onChange(newImages);
	// };

	return (
		<div className="space-y-4">
			{/* Upload Area */}
			<div
				className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
					isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
				}`}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
			>
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept="image/*"
					onChange={(e) => handleFileSelect(e.target.files)}
					className="hidden"
				/>

				<div className="flex flex-col items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
						<Upload className="h-6 w-6 text-gray-600" />
					</div>
					<div>
						<p className="text-lg font-medium text-gray-900">Kéo hình ảnh vào đây hoặc nhấp để tải lên</p>
						<p className="mt-1 text-sm text-gray-600">
							PNG, JPG, GIF tối đa 10MB mỗi ảnh ({images.length}/{maxImages} ảnh)
						</p>
					</div>
					<Button
						type="button"
						variant="outline"
						onClick={() => fileInputRef.current?.click()}
						disabled={images.length >= maxImages}
					>
						<Plus className="mr-2 h-4 w-4" />
						Chọn tệp
					</Button>
				</div>
			</div>

			{/* Image Grid */}
			{images.length > 0 && (
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
					{images.map((image, index) => (
						<Card key={index} className="group relative">
							<CardContent className="p-2">
								<div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
									<Image
										src={
											image ||
											"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
										}
										alt={`Product image ${index + 1}`}
										width={200}
										height={200}
										className="h-full w-full object-cover"
									/>
								</div>

								{/* Image Controls */}
								<div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
									<Button
										type="button"
										variant="destructive"
										size="sm"
										onClick={() => removeImage(index)}
										className="h-8 w-8 p-0"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>

								{/* Primary Image Badge */}
								{index === 0 && (
									<div className="absolute top-2 left-2">
										<span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">Chính</span>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{images.length === 0 && (
				<div className="py-8 text-center text-gray-500">
					<ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
					<p>Chưa tải lên hình ảnh nào</p>
				</div>
			)}
		</div>
	);
}
