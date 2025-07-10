"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "./rich-text-editor";
import ImageManager from "./image-manager";
import CategorySelector from "./category-selector";
import VariationsManager from "./variations-manager";

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

interface ProductFormProps {
	product: Product | null;
	onSave: (product: Partial<Product>) => void;
	onClose: () => void;
}

export default function ProductForm({ product, onSave, onClose }: ProductFormProps) {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: 0,
		images: [] as string[],
		categories: [] as string[],
		inventory: 0,
		variations: [] as ProductVariation[],
		status: "draft" as "active" | "draft" | "archived",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name,
				description: product.description,
				price: product.price,
				images: product.images,
				categories: product.categories,
				inventory: product.inventory,
				variations: product.variations,
				status: product.status,
			});
		}
	}, [product]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Product name is required";
		}

		if (!formData.description.trim()) {
			newErrors.description = "Product description is required";
		}

		if (formData.price <= 0) {
			newErrors.price = "Price must be greater than 0";
		}

		if (formData.inventory < 0) {
			newErrors.inventory = "Inventory cannot be negative";
		}

		if (formData.categories.length === 0) {
			newErrors.categories = "At least one category is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			onSave(formData);
		} catch (error) {
			console.error("Error saving product:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<motion.div
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.95, opacity: 0 }}
				className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl"
			>
				<div className="flex items-center justify-between border-b p-6">
					<h2 className="text-xl font-semibold">{product ? "Edit Product" : "Create New Product"}</h2>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="h-4 w-4" />
					</Button>
				</div>

				<div className="max-h-[calc(90vh-140px)] overflow-y-auto">
					<form onSubmit={handleSubmit} className="p-6">
						<Tabs defaultValue="basic" className="w-full">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="basic">Basic Info</TabsTrigger>
								<TabsTrigger value="media">Media</TabsTrigger>
								<TabsTrigger value="variations">Variations</TabsTrigger>
								<TabsTrigger value="settings">Settings</TabsTrigger>
							</TabsList>

							<TabsContent value="basic" className="mt-6 space-y-6">
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="name">Product Name *</Label>
										<Input
											id="name"
											value={formData.name}
											onChange={(e) => handleInputChange("name", e.target.value)}
											placeholder="Enter product name"
											className={errors.name ? "border-red-500" : ""}
										/>
										{errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
									</div>

									<div className="space-y-2">
										<Label htmlFor="price">Price *</Label>
										<Input
											id="price"
											type="number"
											min="0"
											step="0.01"
											value={formData.price}
											onChange={(e) =>
												handleInputChange("price", Number.parseFloat(e.target.value) || 0)
											}
											placeholder="0.00"
											className={errors.price ? "border-red-500" : ""}
										/>
										{errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="description">Description *</Label>
									<RichTextEditor
										value={formData.description}
										onChange={(value) => handleInputChange("description", value)}
										placeholder="Enter product description"
									/>
									{errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
								</div>

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="inventory">Inventory *</Label>
										<Input
											id="inventory"
											type="number"
											min="0"
											value={formData.inventory}
											onChange={(e) =>
												handleInputChange("inventory", Number.parseInt(e.target.value) || 0)
											}
											placeholder="0"
											className={errors.inventory ? "border-red-500" : ""}
										/>
										{errors.inventory && <p className="text-sm text-red-600">{errors.inventory}</p>}
									</div>

									<div className="space-y-2">
										<Label>Categories *</Label>
										<CategorySelector
											selectedCategories={formData.categories}
											onChange={(categories) => handleInputChange("categories", categories)}
										/>
										{errors.categories && (
											<p className="text-sm text-red-600">{errors.categories}</p>
										)}
									</div>
								</div>
							</TabsContent>

							<TabsContent value="media" className="mt-6 space-y-6">
								<div className="space-y-2">
									<Label>Product Images</Label>
									<ImageManager
										images={formData.images}
										onChange={(images) => handleInputChange("images", images)}
									/>
								</div>
							</TabsContent>

							<TabsContent value="variations" className="mt-6 space-y-6">
								<div className="space-y-2">
									<Label>Product Variations</Label>
									<VariationsManager
										variations={formData.variations}
										onChange={(variations) => handleInputChange("variations", variations)}
									/>
								</div>
							</TabsContent>

							<TabsContent value="settings" className="mt-6 space-y-6">
								<div className="space-y-2">
									<Label htmlFor="status">Status</Label>
									<Select
										value={formData.status}
										onValueChange={(value) => handleInputChange("status", value)}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="draft">Draft</SelectItem>
											<SelectItem value="active">Active</SelectItem>
											<SelectItem value="archived">Archived</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</TabsContent>
						</Tabs>
					</form>
				</div>

				<div className="flex items-center justify-end gap-4 border-t bg-gray-50 p-6">
					<Button variant="outline" onClick={onClose} disabled={isLoading}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isLoading}>
						{isLoading ? (
							<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
						) : (
							<Save className="mr-2 h-4 w-4" />
						)}
						{product ? "Update Product" : "Create Product"}
					</Button>
				</div>
			</motion.div>
		</motion.div>
	);
}
