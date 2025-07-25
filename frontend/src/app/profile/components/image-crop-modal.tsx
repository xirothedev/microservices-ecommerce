"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Crop, X } from "lucide-react";
import { motion } from "motion/react";

interface Point {
	x: number;
	y: number;
}

interface Area {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface CroppedAreaPixels {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface ImageCropModalProps {
	isOpen: boolean;
	onClose: () => void;
	imageSrc: string;
	onCropComplete: (croppedImage: string, croppedFile: File) => void;
	aspectRatio?: number;
	cropShape?: "rect" | "round";
	fileName?: string;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous");
		image.src = url;
	});

const getCroppedImg = async (
	imageSrc: string,
	pixelCrop: CroppedAreaPixels,
	rotation = 0,
	flip = { horizontal: false, vertical: false },
	fileName = "cropped-image",
): Promise<{ file: File; url: string }> => {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("No 2d context");
	}

	const rotRad = (rotation * Math.PI) / 180;

	// Calculate bounding box of the rotated image
	const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

	// Set canvas size to match the bounding box
	canvas.width = bBoxWidth;
	canvas.height = bBoxHeight;

	// Translate canvas context to a central location to allow rotating and flipping around the center
	ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
	ctx.rotate(rotRad);
	ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
	ctx.translate(-image.width / 2, -image.height / 2);

	// Draw rotated image
	ctx.drawImage(image, 0, 0);

	// Create a new canvas for the cropped image
	const croppedCanvas = document.createElement("canvas");
	const croppedCtx = croppedCanvas.getContext("2d");

	if (!croppedCtx) {
		throw new Error("No 2d context");
	}

	// Set the size of the cropped canvas
	croppedCanvas.width = pixelCrop.width;
	croppedCanvas.height = pixelCrop.height;

	// Draw the cropped image onto the new canvas
	croppedCtx.drawImage(
		canvas,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
	);

	// Convert canvas to blob
	return new Promise((resolve) => {
		croppedCanvas.toBlob(
			(blob) => {
				if (!blob) {
					throw new Error("Canvas is empty");
				}
				const fileExtension = imageSrc.indexOf("data:image/png") === 0 ? "png" : "jpeg";
				const mimeType = `image/${fileExtension}`;
				const file = new File([blob], `${fileName}.${fileExtension}`, { type: mimeType });
				const url = URL.createObjectURL(blob);
				resolve({ file, url });
			},
			"image/jpeg",
			0.95,
		);
	});
};

const rotateSize = (width: number, height: number, rotation: number) => {
	const rotRad = (rotation * Math.PI) / 180;

	return {
		width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
		height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
	};
};

export default function ImageCropModal({
	isOpen,
	onClose,
	imageSrc,
	onCropComplete,
	aspectRatio = 1,
	cropShape = "rect",
	fileName = "cropped-image",
}: ImageCropModalProps) {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [rotation, setRotation] = useState(0);
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const onCropChange = useCallback((crop: Point) => {
		setCrop(crop);
	}, []);

	const onCropAreaChange = useCallback((croppedArea: Area, croppedAreaPixels: CroppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	const onZoomChange = useCallback((zoom: number) => {
		setZoom(zoom);
	}, []);

	const onRotationChange = useCallback((rotation: number) => {
		setRotation(rotation);
	}, []);

	const handleCropImage = useCallback(async () => {
		if (!croppedAreaPixels) return;

		try {
			setIsProcessing(true);
			const { file, url } = await getCroppedImg(
				imageSrc,
				croppedAreaPixels,
				rotation,
				{ horizontal: false, vertical: false },
				fileName,
			);
			onCropComplete(url, file);
			onClose();
		} catch (e) {
			console.error("Error cropping image:", e);
		} finally {
			setIsProcessing(false);
		}
	}, [croppedAreaPixels, imageSrc, rotation, onCropComplete, onClose, fileName]);

	const resetCrop = () => {
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setRotation(0);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="flex h-[90vh] w-full max-w-4xl flex-col dark:bg-gray-900">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 dark:text-white">
						<Crop className="h-5 w-5" />
						Crop Profile Picture
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-1 flex-col gap-4">
					{/* Crop Area */}
					<div className="relative flex-1 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
						<Cropper
							image={imageSrc}
							crop={crop}
							rotation={rotation}
							zoom={zoom}
							aspect={aspectRatio}
							cropShape={cropShape}
							onCropChange={onCropChange}
							onRotationChange={onRotationChange}
							onCropComplete={onCropAreaChange}
							onZoomChange={onZoomChange}
							style={{
								containerStyle: {
									width: "100%",
									height: "100%",
									backgroundColor: "transparent",
								},
							}}
						/>
					</div>

					{/* Controls */}
					<div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
						{/* Zoom Control */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
									<ZoomOut className="h-4 w-4" />
									Zoom
								</label>
								<span className="text-sm text-gray-500 dark:text-gray-400">
									{Math.round(zoom * 100)}%
								</span>
							</div>
							<div className="flex items-center gap-3">
								<ZoomOut className="h-4 w-4 text-gray-400" />
								<Slider
									value={[zoom]}
									onValueChange={(value) => setZoom(value[0])}
									min={1}
									max={3}
									step={0.1}
									className="flex-1"
								/>
								<ZoomIn className="h-4 w-4 text-gray-400" />
							</div>
						</div>

						{/* Rotation Control */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
									<RotateCcw className="h-4 w-4" />
									Rotation
								</label>
								<span className="text-sm text-gray-500 dark:text-gray-400">{rotation}°</span>
							</div>
							<div className="flex items-center gap-3">
								<RotateCcw className="h-4 w-4 text-gray-400" />
								<Slider
									value={[rotation]}
									onValueChange={(value) => setRotation(value[0])}
									min={-180}
									max={180}
									step={1}
									className="flex-1"
								/>
								<RotateCw className="h-4 w-4 text-gray-400" />
							</div>
						</div>

						{/* Quick Actions */}
						<div className="flex gap-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setRotation(rotation - 90)}
								className="dark:border-gray-600 dark:text-gray-300"
							>
								<RotateCcw className="mr-1 h-4 w-4" />
								-90°
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setRotation(rotation + 90)}
								className="dark:border-gray-600 dark:text-gray-300"
							>
								<RotateCw className="mr-1 h-4 w-4" />
								+90°
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={resetCrop}
								className="bg-transparent dark:border-gray-600 dark:text-gray-300"
							>
								Reset
							</Button>
						</div>
					</div>
				</div>

				<DialogFooter className="flex gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isProcessing}
						className="bg-transparent dark:border-gray-600 dark:text-gray-300"
					>
						<X className="mr-2 h-4 w-4" />
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleCropImage}
						disabled={isProcessing}
						className="bg-blue-600 text-white hover:bg-blue-700"
					>
						{isProcessing ? (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
								className="mr-2 h-4 w-4"
							>
								<Crop className="h-4 w-4" />
							</motion.div>
						) : (
							<Crop className="mr-2 h-4 w-4" />
						)}
						{isProcessing ? "Processing..." : "Apply Crop"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
