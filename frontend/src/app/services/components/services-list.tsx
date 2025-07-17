"use client";

import axiosInstance from "@/lib/axios";
import { Product } from "@/typings/backend";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import ServiceCard from "./service-card";
import { useFilterStore } from "@/store/use-filter-store";

export default function ServicesList() {
	const [visibleServices, setVisibleServices] = useState(6);
	const [loading, setLoading] = useState(false);
	const {
		data: services,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["products"],
		queryFn: async () => {
			const res = await axiosInstance.get<{ data: Product[] }>("/products");
			return res.data.data;
		},
	});

	const { activeCategory, searchQuery, activePriceRange } = useFilterStore();

	// Filter services based on Zustand filter state
	let filteredServices = services || [];
	if (activeCategory !== "all") {
		filteredServices = filteredServices.filter((s) => s.categoryId === activeCategory);
	}
	if (searchQuery) {
		filteredServices = filteredServices.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
	}
	if (activePriceRange) {
		filteredServices = filteredServices.filter(
			(s) => s.discountPrice >= activePriceRange.min && s.discountPrice <= activePriceRange.max,
		);
	}

	const loadMoreServices = async () => {
		setLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setVisibleServices((prev) => Math.min(prev + 6, filteredServices.length));
		setLoading(false);
	};

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
						onClick={() => window.location.reload()}
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
					<p className="mt-1 text-gray-600">{filteredServices.length} services available</p>
				</div>
			</div>

			<motion.div
				className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				{filteredServices.slice(0, visibleServices).map((service, index) => (
					<motion.div
						key={service.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: index * 0.1 }}
					>
						<ServiceCard service={service} />
					</motion.div>
				))}
			</motion.div>

			{visibleServices < filteredServices.length && (
				<div className="pt-8 text-center">
					<button
						onClick={loadMoreServices}
						disabled={loading}
						className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
					>
						{loading
							? "Loading..."
							: `Load More Services (${filteredServices.length - visibleServices} remaining)`}
					</button>
				</div>
			)}
		</div>
	);
}
