import { create } from "zustand";

type PriceRange = { min: number; max: number } | null;

interface FilterState {
	activeCategory: string;
	searchQuery: string;
	activePriceRange: PriceRange;
	setActiveCategory: (cat: string) => void;
	setSearchQuery: (q: string) => void;
	setActivePriceRange: (range: PriceRange) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
	activeCategory: "all",
	searchQuery: "",
	activePriceRange: null,
	setActiveCategory: (cat) => set({ activeCategory: cat }),
	setSearchQuery: (q) => set({ searchQuery: q }),
	setActivePriceRange: (range) => set({ activePriceRange: range }),
}));
