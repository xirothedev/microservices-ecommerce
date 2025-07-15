"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchFiltersProps {
	sortBy: string;
	sortOrder: "asc" | "desc";
	onSortChange: (field: string, order: "asc" | "desc") => void;
}

export default function SearchFilters({ sortBy, sortOrder, onSortChange }: SearchFiltersProps) {
	const sortOptions = [
		{ value: "updatedAt", label: "Last Updated" },
		{ value: "createdAt", label: "Date Created" },
		{ value: "name", label: "Name" },
		{ value: "price", label: "Price" },
		{ value: "inventory", label: "Inventory" },
	];

	const getCurrentSortLabel = () => {
		const option = sortOptions.find((opt) => opt.value === sortBy);
		return option ? `${option.label} (${sortOrder === "asc" ? "A-Z" : "Z-A"})` : "Sort";
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="min-w-[150px] justify-between bg-transparent">
					{getCurrentSortLabel()}
					<ChevronDown className="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuLabel>Sort by</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{sortOptions.map((option) => (
					<div key={option.value}>
						<DropdownMenuItem
							onClick={() => onSortChange(option.value, "desc")}
							className={sortBy === option.value && sortOrder === "desc" ? "bg-accent" : ""}
						>
							{option.label} (Z-A)
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onSortChange(option.value, "asc")}
							className={sortBy === option.value && sortOrder === "asc" ? "bg-accent" : ""}
						>
							{option.label} (A-Z)
						</DropdownMenuItem>
					</div>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
