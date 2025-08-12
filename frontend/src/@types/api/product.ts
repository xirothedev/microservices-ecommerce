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
	serviceType: ServiceType;
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

export enum ServiceType {
	YOUTUBE = "YOUTUBE",
	NETFLIX = "NETFLIX",
	SPOTIFY = "SPOTIFY",
	DISNEY_PLUS = "DISNEY_PLUS",
	APPLE_TV = "APPLE_TV",
	AMAZON_PRIME = "AMAZON_PRIME",
	HBO_MAX = "HBO_MAX",
	HULU = "HULU",
	PARAMOUNT_PLUS = "PARAMOUNT_PLUS",
	CRUNCHYROLL = "CRUNCHYROLL",
	FUNIMATION = "FUNIMATION",
	TWITCH = "TWITCH",
	DISCORD_NITRO = "DISCORD_NITRO",
	STEAM = "STEAM",
	XBOX_GAME_PASS = "XBOX_GAME_PASS",
	PLAYSTATION_PLUS = "PLAYSTATION_PLUS",
	NINTENDO_ONLINE = "NINTENDO_ONLINE",
	ADOBE_CREATIVE_CLOUD = "ADOBE_CREATIVE_CLOUD",
	MICROSOFT_365 = "MICROSOFT_365",
	GOOGLE_WORKSPACE = "GOOGLE_WORKSPACE",
	NOTION = "NOTION",
	FIGMA = "FIGMA",
	CANVA_PRO = "CANVA_PRO",
	OTHER = "OTHER",
}

export interface ProductWithCategory extends ProductWithAverageRating {
	category: Category;
}

export interface ProductWithAverageRating extends Product {
	averageRating: number;
}
