"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CategorySelectorProps {
	selectedCategories: string[];
	onChange: (categories: string[]) => void;
}

const PREDEFINED_CATEGORIES = [
	"SEO",
	"Tiếp thị số",
	"Mạng xã hội",
	"Tiếp thị nội dung",
	"Phát triển web",
	"Thiết kế",
	"Phân tích",
	"Tiếp thị email",
	"Quảng cáo PPC",
	"Xây dựng thương hiệu",
	"Tư vấn",
	"Chiến lược",
];

export default function CategorySelector({ selectedCategories, onChange }: CategorySelectorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [newCategory, setNewCategory] = useState("");

	const toggleCategory = (category: string) => {
		if (selectedCategories.includes(category)) {
			onChange(selectedCategories.filter((c) => c !== category));
		} else {
			onChange([...selectedCategories, category]);
		}
	};

	const addNewCategory = () => {
		if (newCategory.trim() && !selectedCategories.includes(newCategory.trim())) {
			onChange([...selectedCategories, newCategory.trim()]);
			setNewCategory("");
		}
	};

	const removeCategory = (category: string) => {
		onChange(selectedCategories.filter((c) => c !== category));
	};

	return (
		<div className="space-y-3">
			{/* Selected Categories */}
			{selectedCategories.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{selectedCategories.map((category) => (
						<Badge key={category} variant="secondary" className="flex items-center gap-1">
							{category}
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => removeCategory(category)}
								className="h-4 w-4 p-0 hover:bg-transparent"
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					))}
				</div>
			)}

			{/* Category Selector */}
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" className="w-full justify-start bg-transparent">
						<Plus className="mr-2 h-4 w-4" />
						Thêm danh mục
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80" align="start">
					<div className="space-y-4">
						{/* Add New Category */}
						<div className="flex gap-2">
							<Input
								placeholder="Thêm danh mục mới"
								value={newCategory}
								onChange={(e) => setNewCategory(e.target.value)}
								onKeyPress={(e) => e.key === "Enter" && addNewCategory()}
							/>
							<Button size="sm" onClick={addNewCategory} disabled={!newCategory.trim()}>
								Thêm
							</Button>
						</div>

						{/* Predefined Categories */}
						<div className="space-y-2">
							<h4 className="text-sm font-medium">Danh mục có sẵn</h4>
							<div className="grid max-h-48 grid-cols-1 gap-1 overflow-y-auto">
								{PREDEFINED_CATEGORIES.map((category) => (
									<Button
										key={category}
										variant="ghost"
										size="sm"
										onClick={() => toggleCategory(category)}
										className="h-8 justify-between"
									>
										<span>{category}</span>
										{selectedCategories.includes(category) && (
											<Check className="h-4 w-4 text-green-600" />
										)}
									</Button>
								))}
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
