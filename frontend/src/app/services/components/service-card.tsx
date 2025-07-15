"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { ArrowRight, Clock, Eye, ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import ServiceDetailModal from "./service-detail-modal";

interface Service {
	id: number;
	title: string;
	description: string;
	price: number;
	originalPrice: number;
	image: string;
	category: string;
	rating: number;
	reviews: number;
	deliveryTime: string;
	features: string[];
	popular: boolean;
	specifications?: string[];
	longDescription?: string;
	gallery?: string[];
	requirements?: string[];
	whatYouGet?: string[];
}

interface ServiceCardProps {
	service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [isAddingToCart, setIsAddingToCart] = useState(false);

	const { addToCart, isInCart, getCartItemQuantity } = useCart();

	const discount = Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100);
	const cartQuantity = getCartItemQuantity(service.id);

	const handleAddToCart = async () => {
		setIsAddingToCart(true);
		try {
			await addToCart({
				id: service.id,
				title: service.title,
				price: service.price,
				image: service.image,
				category: service.category,
				deliveryTime: service.deliveryTime,
			});
		} catch (error) {
			console.error("Failed to add to cart:", error);
		} finally {
			setIsAddingToCart(false);
		}
	};

	const handleViewDetails = () => {
		setShowDetailModal(true);
	};

	return (
		<>
			<motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
				<Card className="group h-full overflow-hidden border-0 pt-0 shadow-md transition-all duration-300 hover:shadow-xl">
					{/* Image Section */}
					<div className="relative overflow-hidden">
						<div className="relative aspect-[4/3] bg-gray-100">
							<Image
								src={service.image || "/placeholder.svg?height=300&width=400"}
								alt={service.title}
								fill
								className={`object-cover transition-all duration-500 group-hover:scale-105 ${
									imageLoaded ? "opacity-100" : "opacity-0"
								}`}
								onLoad={() => setImageLoaded(true)}
								loading="lazy"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
							{!imageLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
						</div>

						{/* Overlays */}
						<div className="absolute top-3 left-3 flex gap-2">
							{service.popular && <Badge className="bg-red-500 text-white">Popular</Badge>}
							{discount > 0 && <Badge className="bg-green-500 text-white">{discount}% OFF</Badge>}
							{cartQuantity > 0 && (
								<Badge className="bg-blue-500 text-white">In Cart ({cartQuantity})</Badge>
							)}
						</div>

						{/* Quick Action Overlay */}
						<div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
							<Button
								onClick={handleViewDetails}
								className="bg-white text-black hover:bg-gray-100"
								size="sm"
							>
								<Eye className="mr-2 h-4 w-4" />
								Quick View
							</Button>
							<Button
								onClick={handleAddToCart}
								disabled={isAddingToCart}
								className="bg-blue-600 hover:bg-blue-700"
								size="sm"
							>
								<ShoppingCart className="mr-2 h-4 w-4" />
								{isAddingToCart ? "Adding..." : "Add to Cart"}
							</Button>
						</div>
					</div>

					<CardHeader className="pb-3">
						<div className="flex items-start justify-between gap-2">
							<h3 className="text-lg leading-tight font-semibold transition-colors duration-200 group-hover:text-blue-600">
								{service.title}
							</h3>
						</div>

						<p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{service.description}</p>

						{/* Rating and Reviews */}
						<div className="flex items-center gap-4 text-sm">
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
								<span className="font-medium">{service.rating}</span>
								<span className="text-gray-500">({service.reviews})</span>
							</div>
							<div className="flex items-center gap-1 text-gray-500">
								<Clock className="h-4 w-4" />
								<span>{service.deliveryTime}</span>
							</div>
						</div>
					</CardHeader>

					<CardContent className="py-0">
						{/* Features */}
						<div className="mb-4 space-y-2">
							<div className="flex flex-wrap gap-1">
								{service.features.slice(0, 3).map((feature) => (
									<Badge key={feature} variant="secondary" className="text-xs">
										{feature}
									</Badge>
								))}
								{service.features.length > 3 && (
									<Badge variant="secondary" className="text-xs">
										+{service.features.length - 3} more
									</Badge>
								)}
							</div>
						</div>

						{/* Pricing */}
						<div className="mb-4 flex items-center gap-2">
							<span className="text-2xl font-bold text-gray-900">${service.price}</span>
							{service.originalPrice > service.price && (
								<span className="text-lg text-gray-500 line-through">${service.originalPrice}</span>
							)}
						</div>
					</CardContent>

					<CardFooter className="pt-0">
						<div className="w-full space-y-3">
							<Button
								onClick={handleAddToCart}
								disabled={isAddingToCart}
								className="group w-full bg-blue-600 hover:bg-blue-700"
							>
								<ShoppingCart className="mr-2 h-4 w-4" />
								{isAddingToCart ? "Adding..." : isInCart(service.id) ? "Add More" : "Add to Cart"}
								<ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
							</Button>
							<Button variant="outline" className="w-full bg-transparent" onClick={handleViewDetails}>
								<Eye className="mr-2 h-4 w-4" />
								View Details
							</Button>
						</div>
					</CardFooter>
				</Card>
			</motion.div>

			{/* Service Detail Modal */}
			<ServiceDetailModal
				service={service}
				isOpen={showDetailModal}
				onClose={() => setShowDetailModal(false)}
				onAddToCart={handleAddToCart}
				isAddingToCart={isAddingToCart}
			/>
		</>
	);
}
