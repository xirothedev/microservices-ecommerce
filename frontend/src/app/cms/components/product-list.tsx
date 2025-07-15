"use client";

import { motion } from "motion/react";
import ProductCard from "./product-card";

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

interface ProductListProps {
	products: Product[];
	viewMode: "grid" | "list";
	onEdit: (product: Product) => void;
	onDelete: (productId: string) => void;
	onPreview: (product: Product) => void;
}

export default function ProductList({ products, viewMode, onEdit, onDelete, onPreview }: ProductListProps) {
	if (products.length === 0) {
		return (
			<div className="py-12 text-center">
				<div className="mb-4 text-6xl text-gray-400">📦</div>
				<h3 className="mb-2 text-lg font-medium text-gray-900">No products found</h3>
				<p className="text-gray-600">Get started by creating your first product.</p>
			</div>
		);
	}

	return (
		<motion.div
			className={
				viewMode === "grid"
					? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					: "space-y-4"
			}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			{products.map((product, index) => (
				<motion.div
					key={product.id}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: index * 0.1 }}
				>
					<ProductCard
						product={product}
						viewMode={viewMode}
						onEdit={() => onEdit(product)}
						onDelete={() => onDelete(product.id)}
						onPreview={() => onPreview(product)}
					/>
				</motion.div>
			))}
		</motion.div>
	);
}
