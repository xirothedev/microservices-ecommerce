import { CartItem } from "@/typings/backend";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
	items: CartItem[];
	isOpen: boolean;
	addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
	removeFromCart: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
	toggleCart: () => void;
	getTotalItems: () => number;
	getTotalPrice: () => number;
	isInCart: (id: string) => boolean;
	getCartItemQuantity: (id: string) => number;
}

export const useCart = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],
			isOpen: false,

			addToCart: async (newItem) => {
				const { items } = get();
				const existingItem = items.find((item) => item.id === newItem.id);

				if (existingItem) {
					set({
						items: items.map((item) =>
							item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item,
						),
					});
				} else {
					set({
						items: [...items, { ...newItem, quantity: 1 }],
					});
				}
			},

			removeFromCart: (id) => {
				set({
					items: get().items.filter((item) => item.id !== id),
				});
			},

			updateQuantity: (id, quantity) => {
				if (quantity <= 0) {
					get().removeFromCart(id);
					return;
				}

				set({
					items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
				});
			},

			clearCart: () => {
				set({ items: [] });
			},

			toggleCart: () => {
				set({ isOpen: !get().isOpen });
			},

			getTotalItems: () => {
				return get().items.reduce((total, item) => total + item.quantity, 0);
			},

			getTotalPrice: () => {
				return get().items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
			},

			isInCart: (id) => {
				return get().items.some((item) => item.id === id);
			},

			getCartItemQuantity: (id) => {
				const item = get().items.find((item) => item.id === id);
				return item ? item.quantity : 0;
			},
		}),
		{
			name: "shopping-cart",
			partialize: (state) => ({ items: state.items }),
		},
	),
);
