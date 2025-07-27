"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart, useUpdateCart } from "@/hooks/use-cart";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

interface CartProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Cart({ isOpen, setIsOpen }: CartProps) {
	const [isCheckingOut, setIsCheckingOut] = useState(false);
	const { data, refetch, loading } = useCart();
	const { mutateAsync: addMutate, isPending: addPending } = useUpdateCart(false, refetch);
	const { mutateAsync: removeMutate, isPending: removePending } = useUpdateCart(true, refetch);

	const handleCheckout = async () => {
		setIsCheckingOut(true);
		// Simulate checkout process
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsCheckingOut(false);
		// In a real app, you would navigate to checkout page or process payment
		alert("Checkout functionality would be implemented here!");
	};

	const toggleCart = () => setIsOpen(!isOpen);

	const items = data?.cartItems ?? [];
	const totalItems = items.length ?? 0;
	const totalPrice = items.reduce((sum, cartItem) => sum + cartItem.product.discountPrice * cartItem.quantity, 0);

	return (
		<Sheet open={isOpen} onOpenChange={toggleCart}>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="relative bg-transparent">
					<ShoppingCart className="h-4 w-4" />
					{totalItems > 0 && (
						<Badge className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center bg-blue-600 p-0 text-xs">
							{totalItems}
						</Badge>
					)}
				</Button>
			</SheetTrigger>

			<SheetContent withCloseButton={false} className="w-full sm:max-w-lg">
				<SheetHeader className="shadow-md">
					<SheetTitle className="flex items-center justify-between">
						<span>Shopping Cart ({totalItems})</span>
					</SheetTitle>
				</SheetHeader>

				<div className="flex h-full flex-col px-4">
					{/* Cart Items */}
					<div className="flex-1 overflow-y-auto py-4 pb-20">
						{loading && (
							<div className="flex h-full flex-col items-center justify-center text-center">
								<div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
								<p className="mt-4 text-gray-500">Loading your cart...</p>
							</div>
						)}

						{items.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center text-center">
								<ShoppingCart className="mb-4 h-16 w-16 text-gray-300" />
								<h3 className="mb-2 text-lg font-semibold text-gray-500">Your cart is empty</h3>
								<p className="mb-4 text-gray-400">Add some services to get started!</p>
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
											className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
										>
											{/* Item Image */}
											<div className="flex-shrink-0">
												<div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
													<Image
														src={
															item.product.medias[0] ||
															"/placeholder.svg?height=64&width=64"
														}
														alt={item.product.name}
														fill
														className="object-cover"
													/>
												</div>
											</div>

											{/* Item Details */}
											<div className="min-w-0 flex-1">
												<h4 className="truncate text-sm font-semibold text-gray-900">
													{item.product.name}
												</h4>
												<p className="mb-2 text-xs text-gray-500">
													{item.product.category.name}
												</p>
												<div className="flex items-center justify-between">
													<span className="font-bold text-blue-600">
														${item.product.discountPrice}
													</span>
													<div className="flex items-center gap-2">
														<Button
															variant="outline"
															size="icon"
															disabled={removePending}
															className="h-6 w-6 bg-transparent"
															onClick={() =>
																removeMutate({ productId: item.productId, quantity: 1 })
															}
														>
															<Minus className="h-3 w-3" />
														</Button>
														<span className="w-8 text-center text-sm font-medium">
															{item.quantity}
														</span>
														<Button
															variant="outline"
															size="icon"
															disabled={addPending}
															className="h-6 w-6 bg-transparent"
															onClick={() =>
																addMutate({ productId: item.productId, quantity: 1 })
															}
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
												onClick={() =>
													removeMutate({ productId: item.productId, quantity: item.quantity })
												}
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
						<div className="sticky bottom-0 z-10 space-y-4 border-t border-gray-200 bg-white pt-4">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Subtotal ({totalItems} items)</span>
									<span>${totalPrice.toFixed(2)}</span>
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
