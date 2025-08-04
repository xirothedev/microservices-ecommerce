"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/lib/api/cart";
import { ProductWithAverageRating } from "@/typings/backend";
import { Check, Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ServiceDetailModalProps {
	service: ProductWithAverageRating;
	isOpen: boolean;
	onClose: () => void;
	isAddingToCart: boolean;
}

export default function ServiceDetailModal({ service, isOpen, onClose, isAddingToCart }: ServiceDetailModalProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [quantity, setQuantity] = useState<number>(1);
	const { data } = useCart();

	const discount = Math.round(((service.originalPrice - service.discountPrice) / service.originalPrice) * 100);
	const cartQuantity = data?.cartItems?.find((cartItem) => cartItem.productId === service.id)?.quantity ?? 0;
	const gallery = service.medias;
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[90vh] w-full overflow-y-auto lg:max-w-5xl">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">{service.name}</DialogTitle>
					<DialogDescription>
						View detailed information about {service.name} including images, pricing, and reviews.
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{/* Image Gallery */}
					<div className="space-y-4">
						<Carousel
							opts={{
								align: "start",
								loop: true,
							}}
							className="relative w-full"
						>
							<CarouselContent>
								{gallery.map((image, index) => (
									<CarouselItem key={index}>
										<div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
											<Image
												src={image || "/placeholder.svg?height=400&width=400"}
												alt={`${service.name} ${index + 1}`}
												fill
												className="object-cover"
											/>

											{/* Badges */}
											<div className="absolute top-4 left-4 z-10 flex gap-2">
												{service.flags.includes("POPULAR") && (
													<Badge className="bg-red-500 text-white">Popular</Badge>
												)}
												{discount > 0 && (
													<Badge className="bg-green-500 text-white">{discount}% OFF</Badge>
												)}
											</div>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							{gallery.length > 1 && (
								<>
									<CarouselPrevious className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white" />
									<CarouselNext className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white" />
								</>
							)}
						</Carousel>

						{/* Thumbnail Gallery */}
						{gallery.length > 1 && (
							<div className="flex gap-2 overflow-x-auto">
								{gallery.map((image, index) => (
									<div
										key={index}
										className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 border-gray-200"
									>
										<Image
											src={image || "/placeholder.svg?height=64&width=64"}
											alt={`${service.name} ${index + 1}`}
											width={64}
											height={64}
											className="h-full w-full object-cover"
										/>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Service Details */}
					<div className="space-y-6">
						{/* Header Info */}
						<div className="space-y-4">
							<div className="flex items-center gap-4 text-sm">
								<div className="flex items-center gap-1">
									<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
									<span className="font-medium">{service.averageRating?.toString()}</span>
									{/* <span className="text-gray-500">({service.reviews.length} reviews)</span> */}
								</div>
							</div>

							<p className="leading-relaxed text-gray-600">{service.description}</p>

							{/* Pricing */}
							<div className="flex items-center gap-3">
								<span className="text-3xl font-bold text-gray-900">${service.discountPrice}</span>
								{service.originalPrice > service.discountPrice && (
									<span className="text-xl text-gray-500 line-through">${service.originalPrice}</span>
								)}
								{cartQuantity > 0 && (
									<Badge variant="outline" className="border-blue-600 text-blue-600">
										{cartQuantity} in cart
									</Badge>
								)}
							</div>
						</div>

						{/* Quantity Selector */}
						<div className="flex items-center gap-4">
							<span className="text-sm font-medium">Quantity:</span>
							<div className="flex items-center rounded-lg border px-1">
								<button
									type="button"
									onClick={() => setQuantity(Math.max(1, quantity - 1))}
									className="cursor-pointer rounded-md p-2 transition-colors hover:bg-gray-100"
								>
									<Minus className="h-4 w-4" />
								</button>
								<span className="min-w-[3rem] px-4 py-2 text-center">{quantity}</span>
								<button
									type="button"
									onClick={() => setQuantity(quantity + 1)}
									className="cursor-pointer rounded-md p-2 transition-colors hover:bg-gray-100"
								>
									<Plus className="h-4 w-4" />
								</button>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3">
							<Button
								disabled={isAddingToCart}
								className="flex-1 bg-blue-600 hover:bg-blue-700"
								size="lg"
							>
								<ShoppingCart className="mr-2 h-5 w-5" />
								{isAddingToCart ? "Adding..." : `Add ${quantity} to Cart`}
							</Button>
							<Button
								variant="outline"
								size="lg"
								onClick={() => setIsFavorite(!isFavorite)}
								className={isFavorite ? "border-red-500 text-red-500" : ""}
							>
								<Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
							</Button>
						</div>

						{/* Detailed Information Tabs */}
						<Tabs defaultValue="features" className="w-full">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger className="cursor-pointer" value="features">
									Features
								</TabsTrigger>
								<TabsTrigger className="cursor-pointer" value="specs">
									Specs
								</TabsTrigger>
								<TabsTrigger className="cursor-pointer" value="requirements">
									Requirement
								</TabsTrigger>
								<TabsTrigger className="cursor-pointer" value="included">
									Included
								</TabsTrigger>
							</TabsList>

							<TabsContent value="features" className="space-y-3">
								<h4 className="font-semibold">Key Features</h4>
								<div className="grid grid-cols-1 gap-2">
									{service.tags.map((tags, index) => (
										<div key={index} className="flex items-center gap-2">
											<Check className="h-4 w-4 flex-shrink-0 text-green-500" />
											<span className="text-sm">{tags}</span>
										</div>
									))}
								</div>
							</TabsContent>

							<TabsContent value="specs" className="space-y-3">
								<h4 className="font-semibold">Specifications</h4>
								<div className="grid grid-cols-1 gap-2">
									{[
										"Professional setup and configuration",
										"24/7 customer support included",
										"30-day money-back guarantee",
										"Compatible with all major platforms",
									].map((spec, index) => (
										<div key={index} className="flex items-center gap-2">
											<Check className="h-4 w-4 flex-shrink-0 text-blue-500" />
											<span className="text-sm">{spec}</span>
										</div>
									))}
								</div>
							</TabsContent>

							<TabsContent value="requirements" className="space-y-3">
								<h4 className="font-semibold">Requirements</h4>
								<div className="grid grid-cols-1 gap-2">
									{[
										"Valid email address",
										"Basic account information",
										"Payment method verification",
										"Agreement to terms of service",
									].map((req, index) => (
										<div key={index} className="flex items-center gap-2">
											<Check className="h-4 w-4 flex-shrink-0 text-orange-500" />
											<span className="text-sm">{req}</span>
										</div>
									))}
								</div>
							</TabsContent>

							<TabsContent value="included" className="space-y-3">
								<h4 className="font-semibold">What You Get</h4>
								<div className="grid grid-cols-1 gap-2">
									{[
										"Complete service setup",
										"Detailed documentation",
										"Email support for 30 days",
										"Step-by-step guide",
										"Quality guarantee",
									].map((item, index) => (
										<div key={index} className="flex items-center gap-2">
											<Check className="h-4 w-4 flex-shrink-0 text-green-500" />
											<span className="text-sm">{item}</span>
										</div>
									))}
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
