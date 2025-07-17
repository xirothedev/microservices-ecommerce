"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { useFilterStore } from "@/store/use-filter-store";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, X } from "lucide-react";
import { useState } from "react";

interface Category {
	id: string;
	name: string;
	count: number;
}

const priceRanges = [
	{ id: "under-50", name: "Under $50", min: 0, max: 50, count: 12 },
	{ id: "50-100", name: "$50 - $100", min: 50, max: 100, count: 8 },
	{ id: "100-200", name: "$100 - $200", min: 100, max: 200, count: 4 },
];

export default function ServicesFilter() {
	const { activeCategory, setActiveCategory, searchQuery, setSearchQuery, activePriceRange, setActivePriceRange } =
		useFilterStore();
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const {
		data: categories,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const res = await axiosInstance.get<{ data: Category[] }>("/categories/with-count");
			return res.data.data;
		},
	});

	if (isLoading) {
		return (
			<div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-6 lg:flex-row">
					<div className="flex-1">
						<div className="relative">
							<Input disabled placeholder="Loading services..." className="h-12 animate-pulse pl-10" />
						</div>
					</div>
					<Button variant="outline" disabled className="h-12 animate-pulse lg:hidden">
						<Filter className="mr-2 h-4 w-4" />
						Filters
					</Button>
				</div>
				<div className="mt-6 space-y-6">
					<div>
						<h3 className="mb-3 text-sm font-semibold text-gray-900">Categories</h3>
						<div className="flex flex-wrap gap-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<Button
									key={i}
									variant="outline"
									size="sm"
									disabled
									className="h-8 w-24 animate-pulse"
								/>
							))}
						</div>
					</div>
					<div>
						<h3 className="mb-3 text-sm font-semibold text-gray-900">Price Range</h3>
						<div className="flex flex-wrap gap-2">
							{priceRanges.map((range) => (
								<Button
									key={range.id}
									variant="outline"
									size="sm"
									disabled
									className="h-8 w-28 animate-pulse bg-transparent"
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-6 lg:flex-row">
					<div className="flex-1">
						<div className="relative">
							<Input disabled placeholder="Failed to load filters" className="h-12 pl-10" />
						</div>
					</div>
					<Button variant="outline" disabled className="h-12 lg:hidden">
						<Filter className="mr-2 h-4 w-4" />
						Filters
					</Button>
				</div>
				<div className="mt-6 text-center text-red-600">
					<p>⚠️ Failed to load filter options. Please try again later.</p>
				</div>
			</div>
		);
	}

	if (!categories || categories.length === 0) {
		return (
			<div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-6 lg:flex-row">
					<div className="flex-1">
						<div className="relative">
							<Input
								placeholder="Search services..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="h-12 pl-10"
							/>
						</div>
					</div>
					<Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 lg:hidden">
						<Filter className="mr-2 h-4 w-4" />
						Filters
					</Button>
				</div>
				<div className="mt-6 text-center text-gray-600">
					<p>📦 No categories available.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
			<div className="flex flex-col gap-6 lg:flex-row">
				{/* Search */}
				<div className="flex-1">
					<div className="relative">
						<Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
						<Input
							placeholder="Search services..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-12 pl-10"
						/>
					</div>
				</div>

				{/* Filter Toggle */}
				<Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 lg:hidden">
					<Filter className="mr-2 h-4 w-4" />
					Filters
				</Button>
			</div>

			{/* Filters */}
			<div className={`mt-6 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
				{/* Categories */}
				<div>
					<h3 className="mb-3 text-sm font-semibold text-gray-900">Categories</h3>
					<div className="flex flex-wrap gap-2">
						{categories.map((category) => (
							<Button
								key={category.id}
								variant={activeCategory === category.id ? "default" : "outline"}
								size="sm"
								onClick={() => setActiveCategory(category.id)}
								className="h-8"
							>
								{category.name}
								<Badge variant="secondary" className="ml-2 text-xs">
									{category.count}
								</Badge>
							</Button>
						))}
					</div>
				</div>

				{/* Price Ranges */}
				<div>
					<h3 className="mb-3 text-sm font-semibold text-gray-900">Price Range</h3>
					<div className="flex flex-wrap gap-2">
						{priceRanges.map((range) => (
							<Button
								key={range.id}
								variant={
									activePriceRange?.min === range.min && activePriceRange?.max === range.max
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() => setActivePriceRange({ min: range.min, max: range.max })}
								className="h-8"
							>
								{range.name}
								<Badge variant="secondary" className="ml-2 text-xs">
									{range.count}
								</Badge>
							</Button>
						))}
						{activePriceRange && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setActivePriceRange(null)}
								className="h-8 text-xs text-gray-500"
							>
								Clear Price
							</Button>
						)}
					</div>
				</div>

				{/* Active Filters */}
				{(activeCategory !== "all" || searchQuery || activePriceRange) && (
					<div>
						<h3 className="mb-3 text-sm font-semibold text-gray-900">Active Filters</h3>
						<div className="flex flex-wrap gap-2">
							{activeCategory !== "all" && (
								<Badge
									variant="secondary"
									className="flex cursor-pointer items-center gap-1"
									onClick={() => setActiveCategory("all")}
								>
									{categories.find((c) => c.id === activeCategory)?.name}
									<X className="h-3 w-3" />
								</Badge>
							)}
							{searchQuery && (
								<Badge
									variant="secondary"
									className="flex cursor-pointer items-center gap-1"
									onClick={() => setSearchQuery("")}
								>
									Search: {searchQuery}
									<X className="h-3 w-3" />
								</Badge>
							)}
							{activePriceRange && (
								<Badge
									variant="secondary"
									className="flex cursor-pointer items-center gap-1"
									onClick={() => setActivePriceRange(null)}
								>
									Price: {activePriceRange.min} - {activePriceRange.max}
									<X className="h-3 w-3" />
								</Badge>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
