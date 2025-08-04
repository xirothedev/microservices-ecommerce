"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Plus, Search, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import SearchFilters from "@/app/cms/components/search-filters";
import ProductList from "@/app/cms/components/product-list";
import PreviewModal from "@/app/cms/components/preview-modal";
import ProductForm from "@/app/cms/components/product-form";

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

export default function CmsLayout() {
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("updatedAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [isLoading, setIsLoading] = useState(true);

	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	// Mock data - In real app, this would come from an API
	useEffect(() => {
		const mockProducts: Product[] = [
			{
				id: "1",
				name: "Premium SEO Package",
				description:
					"<p>Comprehensive SEO optimization for your website including keyword research, on-page optimization, and monthly reporting.</p>",
				price: 299,
				images: [
					"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=300&width=300",
				],
				categories: ["SEO", "Digital Marketing"],
				inventory: 50,
				variations: [
					{
						id: "duration",
						name: "Duration",
						options: [
							{ id: "1month", value: "1 Month", price: 299, inventory: 50 },
							{ id: "3months", value: "3 Months", price: 799, inventory: 30 },
							{ id: "6months", value: "6 Months", price: 1499, inventory: 20 },
						],
					},
				],
				status: "active",
				createdAt: "2024-01-15T10:00:00Z",
				updatedAt: "2024-01-20T14:30:00Z",
			},
			{
				id: "2",
				name: "Social Media Management",
				description:
					"<p>Complete social media management including content creation, posting schedule, and engagement tracking.</p>",
				price: 199,
				images: [
					"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=300&width=300",
				],
				categories: ["Social Media", "Content Marketing"],
				inventory: 25,
				variations: [
					{
						id: "platforms",
						name: "Platforms",
						options: [
							{ id: "basic", value: "Basic (2 platforms)", price: 199, inventory: 25 },
							{ id: "standard", value: "Standard (4 platforms)", price: 349, inventory: 15 },
							{ id: "premium", value: "Premium (6+ platforms)", price: 499, inventory: 10 },
						],
					},
				],
				status: "active",
				createdAt: "2024-01-10T09:00:00Z",
				updatedAt: "2024-01-18T16:45:00Z",
			},
			{
				id: "3",
				name: "Website Design & Development",
				description: "<p>Custom website design and development with responsive layout and modern features.</p>",
				price: 1299,
				images: [
					"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=300&width=300",
				],
				categories: ["Web Development", "Design"],
				inventory: 10,
				variations: [
					{
						id: "pages",
						name: "Pages",
						options: [
							{ id: "basic", value: "Basic (5 pages)", price: 1299, inventory: 10 },
							{ id: "standard", value: "Standard (10 pages)", price: 1999, inventory: 8 },
							{ id: "premium", value: "Premium (15+ pages)", price: 2999, inventory: 5 },
						],
					},
				],
				status: "draft",
				createdAt: "2024-01-05T11:00:00Z",
				updatedAt: "2024-01-22T10:15:00Z",
			},
		];

		setTimeout(() => {
			setProducts(mockProducts);
			setFilteredProducts(mockProducts);
			setIsLoading(false);
		}, 1000);
	}, []);

	// Filter and search products
	useEffect(() => {
		let filtered = [...products];

		if (debouncedSearchQuery) {
			filtered = filtered.filter(
				(product) =>
					product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
					product.categories.some((cat) => cat.toLowerCase().includes(debouncedSearchQuery.toLowerCase())),
			);
		}

		// Sort products
		filtered.sort((a, b) => {
			let aValue = a[sortBy as keyof Product];
			let bValue = b[sortBy as keyof Product];

			if (sortBy === "price") {
				aValue = a.price;
				bValue = b.price;
			} else if (sortBy === "createdAt" || sortBy === "updatedAt") {
				aValue = new Date(a[sortBy]).getTime();
				bValue = new Date(b[sortBy]).getTime();
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		setFilteredProducts(filtered);
	}, [products, debouncedSearchQuery, sortBy, sortOrder]);

	const handleCreateProduct = () => {
		setSelectedProduct(null);
		setIsFormOpen(true);
	};

	const handleEditProduct = (product: Product) => {
		setSelectedProduct(product);
		setIsFormOpen(true);
	};

	const handleDeleteProduct = (productId: string) => {
		setProducts((prev) => prev.filter((p) => p.id !== productId));
	};

	const handleSaveProduct = (productData: Partial<Product>) => {
		if (selectedProduct) {
			// Update existing product
			setProducts((prev) =>
				prev.map((p) =>
					p.id === selectedProduct.id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p,
				),
			);
		} else {
			// Create new product
			const newProduct: Product = {
				id: Date.now().toString(),
				name: productData.name || "",
				description: productData.description || "",
				price: productData.price || 0,
				images: productData.images || [],
				categories: productData.categories || [],
				inventory: productData.inventory || 0,
				variations: productData.variations || [],
				status: productData.status || "draft",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			setProducts((prev) => [...prev, newProduct]);
		}
		setIsFormOpen(false);
	};

	const handlePreviewProduct = (product: Product) => {
		setPreviewProduct(product);
		setIsPreviewOpen(true);
	};

	const getStatusStats = () => {
		const stats = products.reduce(
			(acc, product) => {
				acc[product.status] = (acc[product.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return {
			total: products.length,
			active: stats.active || 0,
			draft: stats.draft || 0,
			archived: stats.archived || 0,
		};
	};

	const stats = getStatusStats();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h1 className="mb-2 text-3xl font-bold">Content Management System</h1>
					<p className="text-gray-600">Manage your product listings and content</p>
				</div>
				<div className="mt-4 flex items-center gap-4 lg:mt-0">
					<Button onClick={handleCreateProduct} variant="default">
						<Plus className="mr-2 h-4 w-4" />
						Add Product
					</Button>
				</div>
			</div>

			{/* Stats */}
			<div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
				<div className="rounded-lg border bg-white p-4 shadow-sm">
					<div className="text-2xl font-bold text-gray-900">{stats.total}</div>
					<div className="text-sm text-gray-600">Total Products</div>
				</div>
				<div className="rounded-lg border bg-white p-4 shadow-sm">
					<div className="text-2xl font-bold text-green-600">{stats.active}</div>
					<div className="text-sm text-gray-600">Active</div>
				</div>
				<div className="rounded-lg border bg-white p-4 shadow-sm">
					<div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
					<div className="text-sm text-gray-600">Draft</div>
				</div>
				<div className="rounded-lg border bg-white p-4 shadow-sm">
					<div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
					<div className="text-sm text-gray-600">Archived</div>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-4 lg:flex-row">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							<Input
								placeholder="Search products by name or category..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>
					<SearchFilters
						sortBy={sortBy}
						sortOrder={sortOrder}
						onSortChange={(field, order) => {
							setSortBy(field);
							setSortOrder(order);
						}}
					/>
					<div className="flex items-center gap-2">
						<Button
							variant={viewMode === "grid" ? "default" : "outline"}
							size="sm"
							onClick={() => setViewMode("grid")}
						>
							<Grid className="h-4 w-4" />
						</Button>
						<Button
							variant={viewMode === "list" ? "default" : "outline"}
							size="sm"
							onClick={() => setViewMode("list")}
						>
							<List className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Product List */}
			<ProductList
				products={filteredProducts}
				viewMode={viewMode}
				onEdit={handleEditProduct}
				onDelete={handleDeleteProduct}
				onPreview={handlePreviewProduct}
			/>

			{/* Product Form Modal */}
			<AnimatePresence>
				{isFormOpen && (
					<ProductForm
						product={selectedProduct}
						onSave={handleSaveProduct}
						onClose={() => setIsFormOpen(false)}
					/>
				)}
			</AnimatePresence>

			{/* Preview Modal */}
			<AnimatePresence>
				{isPreviewOpen && previewProduct && (
					<PreviewModal product={previewProduct} onClose={() => setIsPreviewOpen(false)} />
				)}
			</AnimatePresence>
		</div>
	);
}
