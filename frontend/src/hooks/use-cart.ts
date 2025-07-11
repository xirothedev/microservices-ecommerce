"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: number
  title: string
  price: number
  image: string
  category: string
  deliveryTime: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isInCart: (id: number) => boolean
  getCartItemQuantity: (id: number) => number
  toggleCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addToCart: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            }
          } else {
            return {
              items: [...state.items, { ...newItem, quantity: 1 }],
            }
          }
        })
      },

      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id)
          return
        }

        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      isInCart: (id) => {
        return get().items.some((item) => item.id === id)
      },

      getCartItemQuantity: (id) => {
        const item = get().items.find((item) => item.id === id)
        return item ? item.quantity : 0
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },
    }),
    {
      name: "shopping-cart",
    },
  ),
)
