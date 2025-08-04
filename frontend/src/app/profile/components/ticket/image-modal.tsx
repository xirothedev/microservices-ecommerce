"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageModalProps {
	isOpen: boolean;
	onClose: () => void;
	imageUrl: string;
	fileName: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl, fileName }: ImageModalProps) {
	const [zoom, setZoom] = useState(1);

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = imageUrl;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleZoomIn = () => {
		setZoom((prev) => Math.min(prev + 0.25, 3));
	};

	const handleZoomOut = () => {
		setZoom((prev) => Math.max(prev - 0.25, 0.5));
	};

	const resetZoom = () => {
		setZoom(1);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
				<DialogHeader className="sr-only">
					<DialogTitle>Image Viewer</DialogTitle>
					<DialogDescription>View and download image: {fileName}</DialogDescription>
				</DialogHeader>
				{/* Header */}
				<div className="flex items-center justify-between border-b bg-white p-4">
					<h3 className="truncate text-lg font-semibold">{fileName}</h3>
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
							<ZoomOut className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" onClick={resetZoom} className="min-w-16">
							{Math.round(zoom * 100)}%
						</Button>
						<Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
							<ZoomIn className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" onClick={handleDownload}>
							<Download className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" onClick={onClose}>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Image Container */}
				<div className="flex flex-1 items-center justify-center overflow-auto bg-gray-50 p-4">
					<div className="relative transition-transform duration-200" style={{ transform: `scale(${zoom})` }}>
						<Image
							src={imageUrl}
							alt={fileName}
							width={800}
							height={600}
							className="h-auto max-w-full rounded-lg shadow-lg"
							style={{ maxHeight: "70vh" }}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
