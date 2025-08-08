"use client";

import { useDebounce } from "@/hooks/use-debounce";
import axiosInstance from "@/lib/axios";
import { useFilterStore } from "@/store/use-filter-store";
import { IAxiosError } from "@/@types";
import { ProductWithAverageRating } from "@/@types/api/product";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import InfiniteScroll from "react-infinite-scroll-component";
import ServiceCard from "./service-card";

const PAGE_SIZE = 12;

type ProductsApiResponse = {
	data: ProductWithAverageRating[];
	"@data"?: {
		totalItems: number;
		nextCursor?: string;
		hasNextPage?: boolean;
	};
};

export default function ServicesList() {
	const { activeCategory, searchQuery, activePriceRange } = useFilterStore();
	const debouncedSearchQuery = useDebounce<string>(searchQuery, 1000);

	const { data, isLoading, isError, error, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery<
		ProductsApiResponse,
		IAxiosError
	>({
		queryKey: ["products", activeCategory, debouncedSearchQuery, activePriceRange],
		queryFn: async ({ pageParam }) => {
			const params: Record<string, unknown> = { limit: PAGE_SIZE };
			if (pageParam) params.cursor = pageParam;
			if (activeCategory && activeCategory !== "all") params.categoryId = activeCategory;
			if (debouncedSearchQuery) params.search = debouncedSearchQuery;
			if (activePriceRange) {
				params.minPrice = activePriceRange.min;
				params.maxPrice = activePriceRange.max;
			}
			const res = await axiosInstance.get<ProductsApiResponse>("/products", { params });
			return res.data;
		},
		getNextPageParam: (lastPage: ProductsApiResponse) => {
			return lastPage?.["@data"]?.nextCursor || null;
		},
		select: (data) => data,
		initialPageParam: undefined,
	});

	// Flatten all loaded products
	const services: ProductWithAverageRating[] = (data?.pages || []).flatMap(
		(page: ProductsApiResponse) => page.data || [],
	);

	// Remove client-side filtering (all filters are now backend)
	const filteredServices = services;

	// Loading state
	if (isLoading) {
		return (
			<div id="services-list" className="space-y-8">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
						<p className="mt-1 text-gray-600">Loading services...</p>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, index) => (
						<div key={index} className="h-64 animate-pulse rounded-lg bg-gray-200" />
					))}
				</div>
			</div>
		);
	}

	// Error state
	if (isError) {
		return (
			<div id="services-list" className="space-y-8">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
						<p className="mt-1 text-red-600">Failed to load services</p>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
					<div className="mb-4 text-6xl">⚠️</div>
					<h3 className="mb-2 text-lg font-semibold text-gray-900">Something went wrong</h3>
					<p className="mb-4 text-gray-600">
						{error instanceof Error ? error.message : "Failed to load services"}
					</p>
					<button
						onClick={() => refetch()}
						className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	// No data state
	if (!filteredServices || filteredServices.length === 0) {
		return (
			<div id="services-list" className="space-y-8">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
						<p className="mt-1 text-gray-600">No services available</p>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
					<div className="mb-4 text-6xl">📦</div>
					<h3 className="mb-2 text-lg font-semibold text-gray-900">No services found</h3>
					<p className="text-gray-600">There are currently no services available. Please check back later.</p>
				</div>
			</div>
		);
	}

	return (
		<div id="services-list" className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
					<p className="mt-1 text-gray-600">{data?.pages[0]["@data"]?.totalItems ?? 0} services available</p>
				</div>
			</div>

			<InfiniteScroll
				dataLength={filteredServices.length}
				next={fetchNextPage}
				hasMore={!!hasNextPage}
				loader={
					<div className="mt-4 flex items-center justify-center py-4">
						<div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
						<span className="ml-2 text-gray-500">Loading...</span>
					</div>
				}
				endMessage={<div className="py-4 text-center text-gray-500">End</div>}
				scrollThreshold={0.75}
			>
				<motion.div
					className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6 }}
				>
					{filteredServices.map((service, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2, delay: index * 0.05 }}
						>
							<ServiceCard service={service} />
						</motion.div>
					))}
				</motion.div>
			</InfiniteScroll>
		</div>
	);
}
