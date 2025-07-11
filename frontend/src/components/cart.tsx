"use client";

import { useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/hooks/use-cart";

export default function Cart() {
	const { items, isOpen, toggleCart, updateQuantity, removeFromCart, clearCart, getTotalItems, getTotalPrice } =
		useCart();

	const [isCheckingOut, setIsCheckingOut] = useState(false);

	const handleCheckout = async () => {
		setIsCheckingOut(true);
		// Simulate checkout process
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsCheckingOut(false);
		// In a real app, you would navigate to checkout page or process payment
		alert("Checkout functionality would be implemented here!");
	};

	const totalItems = getTotalItems();
	const totalPrice = getTotalPrice();

	return (
		<Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Shopping Cart ({totalItems})</span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-500 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">Your cart is empty</h3>
                <p className="text-gray-400 mb-4">Add some services to get started!</p>
                <Button onClick={toggleCart} variant="outline" className="bg-transparent">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                    >
                      {/* Item Image */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 relative bg-gray-100  rounded-lg overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg?height=64&width=64"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600">${item.price}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-700"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Estimated delivery</span>
                  <span>2-5 business days</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : `Checkout - $${totalPrice.toFixed(2)}`}
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={toggleCart}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
	);
}
