"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { Context, ContextInput } from "@/typings/backend";
import { CreditCard, Package, Search, ShoppingBag, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";

interface ContextSelectorProps {
	selectedContexts: ContextInput[];
	onContextsChange: (contexts: ContextInput[]) => void;
	disabled?: boolean;
}

export default function ContextSelector({
	selectedContexts,
	onContextsChange,
	disabled = false,
}: ContextSelectorProps) {
	const [inputValue, setInputValue] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);

	// Debounce search query to avoid too many API calls
	const debouncedSearchQuery = useDebounce(inputValue, 300);

	const contextIcons = {
		order: ShoppingBag,
		product: Package,
		transaction: CreditCard,
		account: User,
	};

	const contextColors = {
		order: "bg-blue-100 text-blue-800",
		product: "bg-green-100 text-green-800",
		transaction: "bg-purple-100 text-purple-800",
		account: "bg-orange-100 text-orange-800",
	};

	// Fetch contexts from API
	const { data: searchResults, isLoading } = useQuery({
		queryKey: ["contexts", debouncedSearchQuery],
		queryFn: async () => {
			if (!debouncedSearchQuery || debouncedSearchQuery.length < 2) {
				return [];
			}

			try {
				const response = await axiosInstance.get("/contexts/search", {
					params: {
						query: debouncedSearchQuery,
						limit: 8,
					},
				});
				return response.data.data || [];
			} catch (error) {
				console.error("Failed to search contexts:", error);
				return [];
			}
		},
		enabled: debouncedSearchQuery.length >= 2,
	});

	// Filter out already selected contexts
	const filteredSuggestions = (searchResults || []).filter(
		(context: Context & { type: string }) =>
			!selectedContexts.some((selected) => selected.labelId === context.id && selected.type === context.type),
	);

	useEffect(() => {
		if (debouncedSearchQuery.length >= 2 && filteredSuggestions.length > 0) {
			setShowSuggestions(true);
		} else {
			setShowSuggestions(false);
		}
	}, [debouncedSearchQuery, filteredSuggestions.length]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		setInputValue(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (disabled) return;

		if (e.key === "Escape") {
			setShowSuggestions(false);
			setInputValue("");
		}
	};

	const selectContext = (context: Context & { type: string }) => {
		if (disabled) return;

		const newContext: ContextInput = {
			type: context.type,
			labelId: context.id,
			label: context.label,
		};

		onContextsChange([...selectedContexts, newContext]);
		setInputValue("");
		setShowSuggestions(false);
		inputRef.current?.focus();
	};

	const removeContext = (index: number) => {
		if (disabled) return;
		const newContexts = selectedContexts.filter((_, i) => i !== index);
		onContextsChange(newContexts);
	};

	const getContextIcon = (type: string) => {
		const IconComponent = contextIcons[type as keyof typeof contextIcons];
		return IconComponent ? <IconComponent className="h-3 w-3" /> : <Package className="h-3 w-3" />;
	};

	const getContextColor = (type: string) => {
		return contextColors[type as keyof typeof contextColors] || "bg-gray-100 text-gray-800";
	};

	// Close suggestions when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				suggestionsRef.current &&
				!suggestionsRef.current.contains(event.target as Node) &&
				!inputRef.current?.contains(event.target as Node)
			) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="space-y-3">
			<div className="relative">
				<div className="relative">
					<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
					<Input
						ref={inputRef}
						type="text"
						placeholder="Type to search orders, products, transactions... (e.g., 'Order #ORD-001')"
						value={inputValue}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						onFocus={() => inputValue && setShowSuggestions(filteredSuggestions.length > 0)}
						className="pl-10"
						disabled={disabled}
					/>
					{isLoading && (
						<div className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform">
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
						</div>
					)}
				</div>

				{/* Suggestions Dropdown */}
				<AnimatePresence>
					{showSuggestions && (
						<motion.div
							ref={suggestionsRef}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="absolute top-full right-0 left-0 z-50 mt-1"
						>
							<Card className="shadow-lg">
								<CardContent className="p-2">
									<div className="space-y-1">
										{filteredSuggestions.length === 0 ? (
											<div className="p-2 text-center text-sm text-gray-500">
												{isLoading ? "Searching..." : "No results found"}
											</div>
										) : (
											filteredSuggestions.map((suggestion: Context & { type: string }) => (
												<button
													key={`${suggestion.type}-${suggestion.id}`}
													onClick={() => selectContext(suggestion)}
													className="flex w-full items-center gap-2 rounded p-2 text-left transition-colors hover:bg-gray-100"
												>
													<div className={`rounded p-1 ${getContextColor(suggestion.type)}`}>
														{getContextIcon(suggestion.type)}
													</div>
													<div className="min-w-0 flex-1">
														<div className="truncate text-sm font-medium">
															{suggestion.label}
														</div>
														<div className="text-xs text-gray-500 capitalize">
															{suggestion.type}
														</div>
													</div>
												</button>
											))
										)}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Selected Contexts */}
			<AnimatePresence>
				{selectedContexts.length > 0 && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="space-y-2"
					>
						<div className="text-sm font-medium text-gray-700">Referenced Items:</div>
						<div className="flex flex-wrap gap-2">
							{selectedContexts.map((context, index) => (
								<motion.div
									key={`selected-${context.type}-${context.labelId}-${index}`}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
								>
									<Badge
										variant="secondary"
										className={`${getContextColor(context.type)} gap-1 pr-1`}
									>
										{getContextIcon(context.type)}
										<span className="max-w-48 truncate">{context.label}</span>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => removeContext(index)}
											disabled={disabled}
											className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
										>
											<X className="h-3 w-3" />
										</Button>
									</Badge>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Helper Text */}
			<div className="text-xs text-gray-500">
				Tip: Reference your orders, products, or transactions to help our support team understand your issue
				better. Start typing to search for relevant items.
			</div>
		</div>
	);
}
