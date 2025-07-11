"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Edit, Trash2, Eye, MoreVertical, Package, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { formatDate } from "@/lib/format-date";

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	images: string[];
	categories: string[];
	inventory: number;
	variations: ProductVariation[];
	status: "active" | "draft" | "archived";
	createdAt: string;
	updatedAt: string;
}

interface ProductVariation {
	id: string;
	name: string;
	options: VariationOption[];
}

interface VariationOption {
	id: string;
	value: string;
	price: number;
	inventory: number;
}

interface ProductCardProps {
	product: Product;
	viewMode: "grid" | "list";
	onEdit: () => void;
	onDelete: () => void;
	onPreview: () => void;
}

const getStatusColor = (status: string) => {
	switch (status) {
		case "active":
			return "bg-green-100 text-green-800";
		case "draft":
			return "bg-yellow-100 text-yellow-800";
		case "archived":
			return "bg-gray-100 text-gray-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

const stripHtml = (html: string) => {
	return html.replace(/<[^>]*>/g, "");
};

export default function ProductCard({ product, viewMode, onEdit, onDelete, onPreview }: ProductCardProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	if (viewMode === "list") {
		return (
			<Card className="transition-shadow hover:shadow-md">
				<CardContent className="p-6">
					<div className="flex items-center gap-4">
						<div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
							{product.images[0] ? (
								<Image
									src={
										product.images[0] ||
										"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
									}
									alt={product.name}
									width={64}
									height={64}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center">
									<Package className="h-6 w-6 text-gray-400" />
								</div>
							)}
						</div>

						<div className="min-w-0 flex-1">
							<div className="flex items-start justify-between">
								<div>
									<h3 className="truncate font-semibold text-gray-900">{product.name}</h3>
									<p className="mt-1 line-clamp-2 text-sm text-gray-600">
										{stripHtml(product.description)}
									</p>
									<div className="mt-2 flex items-center gap-4">
										<div className="flex items-center gap-1 text-sm text-gray-600">
											<DollarSign className="h-4 w-4" />${product.price}
										</div>
										<div className="flex items-center gap-1 text-sm text-gray-600">
											<Package className="h-4 w-4" />
											{product.inventory} in stock
										</div>
										<div className="flex items-center gap-1 text-sm text-gray-600">
											<Calendar className="h-4 w-4" />
											{formatDate(product.updatedAt)}
										</div>
									</div>
								</div>

								<div className="ml-4 flex items-center gap-2">
									<Badge className={getStatusColor(product.status)}>{product.status}</Badge>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="sm">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={onPreview}>
												<Eye className="mr-2 h-4 w-4" />
												Preview
											</DropdownMenuItem>
											<DropdownMenuItem onClick={onEdit}>
												<Edit className="mr-2 h-4 w-4" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => setShowDeleteDialog(true)}
												className="text-red-600"
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
				<Card className="h-full pt-0 transition-shadow hover:shadow-lg">
					<CardHeader className="p-0">
						<div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
							{product.images[0] ? (
								<Image
									src={
										product.images[0] ||
										"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
									}
									alt={product.name}
									width={300}
									height={300}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center">
									<Package className="h-12 w-12 text-gray-400" />
								</div>
							)}
						</div>
					</CardHeader>

					<CardContent className="p-4">
						<div className="mb-2 flex items-start justify-between">
							<h3 className="flex-1 truncate font-semibold text-gray-900">{product.name}</h3>
							<Badge className={`ml-2 ${getStatusColor(product.status)}`}>{product.status}</Badge>
						</div>

						<p className="mb-3 line-clamp-2 text-sm text-gray-600">{stripHtml(product.description)}</p>

						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-600">Price:</span>
								<span className="font-semibold">${product.price}</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-600">Stock:</span>
								<span className={product.inventory > 0 ? "text-green-600" : "text-red-600"}>
									{product.inventory}
								</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-600">Updated:</span>
								<span>{formatDate(product.updatedAt)}</span>
							</div>
						</div>

						{product.categories.length > 0 && (
							<div className="mt-3">
								<div className="flex flex-wrap gap-1">
									{product.categories.slice(0, 2).map((category) => (
										<Badge key={category} variant="secondary" className="text-xs">
											{category}
										</Badge>
									))}
									{product.categories.length > 2 && (
										<Badge variant="secondary" className="text-xs">
											+{product.categories.length - 2}
										</Badge>
									)}
								</div>
							</div>
						)}
					</CardContent>

					<CardFooter className="p-4 pt-0">
						<div className="flex w-full gap-2">
							<Button variant="outline" size="sm" onClick={onPreview} className="flex-1 bg-transparent">
								<Eye className="mr-1 h-4 w-4" />
								Preview
							</Button>
							<Button variant="outline" size="sm" onClick={onEdit} className="flex-1 bg-transparent">
								<Edit className="mr-1 h-4 w-4" />
								Edit
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowDeleteDialog(true)}
								className="text-red-600 hover:text-red-700"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</CardFooter>
				</Card>
			</motion.div>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Product</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{product.name}"? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								onDelete();
								setShowDeleteDialog(false);
							}}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
