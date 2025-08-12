"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/lib/api/cart";

export default function CartContent() {
	const { items, updateQuantity, removeFromCart, clearCart, getTotalItems, getTotalPrice } = useCart();
	const [promoCode, setPromoCode] = useState("");
	const [discount, setDiscount] = useState(0);
	const [isApplyingPromo, setIsApplyingPromo] = useState(false);

	const totalItems = getTotalItems();
	const subtotal = getTotalPrice();
	const shipping = subtotal > 500 ? 0 : 50;
	const tax = subtotal * 0.1;
	const total = subtotal + shipping + tax - discount;

	const handleApplyPromo = async () => {
		setIsApplyingPromo(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (promoCode.toLowerCase() === "save10") {
			setDiscount(subtotal * 0.1);
		} else if (promoCode.toLowerCase() === "welcome20") {
			setDiscount(subtotal * 0.2);
		} else {
			setDiscount(0);
		}
		setIsApplyingPromo(false);
	};

	if (items.length === 0) {
		return (
			<div className="py-16 text-center">
				<ShoppingCart className="mx-auto mb-6 h-24 w-24 text-gray-300" />
				<h1 className="mb-4 text-3xl font-bold text-gray-900">Giỏ hàng của bạn trống</h1>
				<p className="mx-auto mb-8 max-w-md text-gray-600">
					Có vẻ như bạn chưa thêm dịch vụ nào vào giỏ hàng. Hãy duyệt các dịch vụ của chúng tôi và tìm thứ bạn
					thích!
				</p>
				<Link href="/services">
					<Button size="lg" className="bg-blue-600 hover:bg-blue-700">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Tiếp tục mua sắm
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
					<p className="mt-2 text-gray-600">
						{totalItems} {totalItems === 1 ? "sản phẩm" : "sản phẩm"} trong giỏ hàng
					</p>
				</div>
				<Link href="/services">
					<Button variant="outline" className="bg-transparent">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Tiếp tục mua sắm
					</Button>
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Cart Items */}
				<div className="space-y-4 lg:col-span-2">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Sản phẩm trong giỏ</CardTitle>
							<Button
								variant="ghost"
								size="sm"
								onClick={clearCart}
								className="text-red-500 hover:text-red-700"
							>
								Xóa tất cả
							</Button>
						</CardHeader>
						<CardContent className="space-y-4">
							<AnimatePresence>
								{items.map((item) => (
									<motion.div
										key={item.id}
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className="flex gap-4 rounded-lg border bg-white p-4"
									>
										{/* Item Image */}
										<div className="flex-shrink-0">
											<div className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
												<Image
													src={item.image || "/placeholder.svg?height=80&width=80"}
													alt={item.title}
													fill
													className="object-cover"
												/>
											</div>
										</div>

										{/* Item Details */}
										<div className="min-w-0 flex-1">
											<div className="mb-2 flex items-start justify-between">
												<div>
													<h3 className="truncate text-lg font-semibold text-gray-900">
														{item.title}
													</h3>
													<Badge variant="secondary" className="mt-1">
														{item.category}
													</Badge>
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="text-red-500 hover:text-red-700"
													onClick={() => removeFromCart(item.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>

											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<Button
														variant="outline"
														size="icon"
														className="h-8 w-8 bg-transparent"
														onClick={() => updateQuantity(item.id, item.quantity - 1)}
													>
														<Minus className="h-3 w-3" />
													</Button>
													<span className="w-8 text-center text-sm font-medium">
														{item.quantity}
													</span>
													<Button
														variant="outline"
														size="icon"
														className="h-8 w-8 bg-transparent"
														onClick={() => updateQuantity(item.id, item.quantity + 1)}
													>
														<Plus className="h-3 w-3" />
													</Button>
												</div>
												<div className="text-right">
													<p className="text-lg font-bold text-blue-600">
														${(item.price * item.quantity).toFixed(2)}
													</p>
													<p className="text-sm text-gray-500">${item.price} mỗi sản phẩm</p>
												</div>
											</div>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</CardContent>
					</Card>
				</div>

				{/* Order Summary */}
				<div className="space-y-6">
					{/* Promo Code */}
					<Card>
						<CardHeader>
							<CardTitle>Mã khuyến mãi</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex gap-2">
								<Input
									placeholder="Nhập mã khuyến mãi"
									value={promoCode}
									onChange={(e) => setPromoCode(e.target.value)}
								/>
								<Button
									onClick={handleApplyPromo}
									disabled={!promoCode || isApplyingPromo}
									className="bg-blue-600 hover:bg-blue-700"
								>
									{isApplyingPromo ? "Đang áp dụng..." : "Áp dụng"}
								</Button>
							</div>
							{discount > 0 && (
								<p className="text-sm text-green-600">
									Mã khuyến mãi đã được áp dụng! Bạn đã tiết kiệm ${discount.toFixed(2)}
								</p>
							)}
							<div className="text-xs text-gray-500">
								<p>Thử: SAVE10 hoặc WELCOME20</p>
							</div>
						</CardContent>
					</Card>

					{/* Order Summary */}
					<Card>
						<CardHeader>
							<CardTitle>Tóm tắt đơn hàng</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								<div className="flex justify-between text-sm">
									<span>Tạm tính ({totalItems} sản phẩm)</span>
									<span>${subtotal.toFixed(2)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span>Vận chuyển</span>
									<span>{shipping === 0 ? "Miễn phí" : `$${shipping.toFixed(2)}`}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span>Thuế</span>
									<span>${tax.toFixed(2)}</span>
								</div>
								{discount > 0 && (
									<div className="flex justify-between text-sm text-green-600">
										<span>Giảm giá</span>
										<span>-${discount.toFixed(2)}</span>
									</div>
								)}
								<Separator />
								<div className="flex justify-between text-lg font-semibold">
									<span>Tổng cộng</span>
									<span>${total.toFixed(2)}</span>
								</div>
							</div>

							{shipping > 0 && (
								<div className="rounded-lg bg-blue-50 p-3">
									<p className="text-sm text-blue-700">
										Thêm ${(500 - subtotal).toFixed(2)} nữa để được miễn phí vận chuyển!
									</p>
								</div>
							)}

							<Link href="/payment" className="block">
								<Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
									Tiến hành thanh toán
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>

							<div className="text-center">
								<p className="text-xs text-gray-500">Thanh toán an toàn được bảo vệ bởi mã hóa SSL</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
