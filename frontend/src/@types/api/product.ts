export interface Product {
	id: string;
	createdAt: string;
	updatedAt: string;
	sku: string | null;
	isActive: boolean;
	slug: string;
	name: string;
	description: string;
	stock: number;
	sold: number;
	flags: ProductFlag[];
	originalPrice: number;
	discountPrice: number;
	tags: string[];
	medias: string[];
	isVerified: boolean;
	categoryId: string;
	sellerId: string;
}

export interface ProductItem {
	id: string;
	productId: string;
	product: Product;
	data: string;
	isSold: boolean;
	soldAt: string | null;
}
export interface Category {
	id: string;
	name: string;
	slug: string;
}

export enum ProductFlag {
	BEST_CHOICE = "BEST_CHOICE",
	BEST_SELLER = "BEST_SELLER",
	BEST_CHEAP = "BEST_CHEAP",
	POPULAR = "POPULAR",
}

export interface ProductWithCategory extends ProductWithAverageRating {
	category: Category;
}

export interface ProductWithAverageRating extends Product {
	averageRating: number;
}
