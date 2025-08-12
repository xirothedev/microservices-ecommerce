"use client";

import { ProductFlag, ProductWithAverageRating } from "@/@types/api/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCart, useUpdateCart } from "@/lib/api/cart";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ServiceCardProps {
	service: ProductWithAverageRating;
}

export default function ServiceCard({ service }: ServiceCardProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const { data, refetch } = useCart();
	const { mutate, isPending } = useUpdateCart(false, refetch);
	const router = useRouter();

	const discount = Math.round(((service.originalPrice - service.discountPrice) / service.originalPrice) * 100);
	const cartQuantity = data?.cartItems.find((cartItem) => cartItem.productId === service.id)?.quantity ?? 0;

	return (
		<div>
			<Card className="group h-full overflow-hidden border border-gray-200 pt-0 pb-2 transition-all duration-300">
				{/* Image Section */}
				<div className="relative overflow-hidden">
					<div className="relative aspect-video bg-gray-100">
						<Image
							src={service.medias[0] || "/placeholder.svg?height=300&width=400"}
							alt={service.name}
							fill
							className={`object-cover ${imageLoaded ? "opacity-100" : "opacity-0"}`}
							onLoad={() => setImageLoaded(true)}
							loading="lazy"
						/>
						{!imageLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
					</div>

					{/* Overlays */}
					<div className="absolute top-3 left-3 flex gap-2">
						{service.flags.includes(ProductFlag.POPULAR) && (
							<Badge className="bg-red-500 text-white">Popular</Badge>
						)}
						{discount > 0 && <Badge className="bg-green-500 text-white">{discount}% OFF</Badge>}
						{cartQuantity > 0 && <Badge className="bg-blue-500 text-white">In Cart ({cartQuantity})</Badge>}
					</div>
				</div>

				<CardHeader className="px-4">
					{/* Tags moved up */}
					<div className="mb-2 flex flex-wrap gap-1">
						{service.tags.slice(0, 3).map((feature) => (
							<Badge key={feature} variant="secondary" className="text-xs">
								{feature}
							</Badge>
						))}
						{service.tags.length > 3 && (
							<Badge variant="secondary" className="text-xs">
								+{service.tags.length - 3} more
							</Badge>
						)}
					</div>

					<div className="flex items-start justify-between gap-2">
						<h3 className="text-base leading-tight font-semibold transition-colors duration-200 group-hover:text-blue-600">
							{service.name}
						</h3>
					</div>

					<p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{service.description}</p>

					{/* Rating and Reviews */}
					<div className="flex items-center gap-4 text-sm">
						<div className="flex items-center gap-2">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							<span className="font-medium">{service.averageRating?.toString()}</span>
							<span className="text-gray-300">•</span>
							<ShoppingCart className="h-4 w-4 text-gray-500" />
							<span className="text-gray-600">{service.sold.toLocaleString()} lượt mua</span>
						</div>
					</div>
				</CardHeader>

				<CardContent className="px-4">
					{/* Pricing - discount and original side by side */}
					<div className="mb-4 flex items-center gap-2">
						<span className="text-xl font-bold text-gray-900">{service.discountPrice}đ</span>
						{service.originalPrice > service.discountPrice && (
							<span className="text-sm text-gray-500 line-through opacity-70">
								{service.originalPrice}đ
							</span>
						)}
					</div>

					{/* Actions below price */}
					<div className="mb-2 grid grid-cols-2 gap-2">
						<Button
							variant="outline"
							onClick={() => mutate({ productId: service.id, quantity: 1 })}
							disabled={isPending}
						>
							<ShoppingCart className="h-4 w-4" />
						</Button>
						<Button
							className="bg-blue-600 hover:bg-blue-700"
							onClick={() =>
								mutate(
									{ productId: service.id, quantity: 1 },
									{
										onSuccess: () => router.push("/cart"),
									},
								)
							}
							disabled={isPending}
						>
							Mua ngay
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
