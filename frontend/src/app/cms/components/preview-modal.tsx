"use client";

import { motion } from "motion/react";
import { X, ShoppingCart, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	images: string[];
	categories: string[];
	inventory: number;
	variations: ProductVariation[];
	status: "active" | "draft" | "archived";
	createdAt: string;
	updatedAt: string;
}

interface ProductVariation {
	id: string;
	name: string;
	options: VariationOption[];
}

interface VariationOption {
	id: string;
	value: string;
	price: number;
	inventory: number;
}

interface PreviewModalProps {
	product: Product;
	onClose: () => void;
}

export default function PreviewModal({ product, onClose }: PreviewModalProps) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<motion.div
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.95, opacity: 0 }}
				className="max-h-[90vh] w-full max-w-[60vw] overflow-hidden rounded-lg bg-white shadow-xl"
			>
				<div className="flex items-center justify-between border-b p-6">
					<h2 className="text-xl font-semibold">Xem trước sản phẩm</h2>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="h-4 w-4" />
					</Button>
				</div>

				<div className="max-h-[calc(90vh-80px)] overflow-y-auto">
					<div className="p-6">
						<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
							{/* Product Images */}
							<div className="space-y-4">
								<div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
									{product.images[0] ? (
										<Image
											src={
												product.images[0] ||
												"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
											}
											alt={product.name}
											width={500}
											height={500}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center">
											<Package className="h-16 w-16 text-gray-400" />
										</div>
									)}
								</div>

								{product.images.length > 1 && (
									<div className="grid grid-cols-4 gap-2">
										{product.images.slice(1, 5).map((image, index) => (
											<div
												key={index}
												className="aspect-square overflow-hidden rounded-lg bg-gray-100"
											>
												<Image
													src={
														image ||
														"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
													}
													alt={`${product.name} ${index + 2}`}
													width={100}
													height={100}
													className="h-full w-full object-cover"
												/>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Product Details */}
							<div className="space-y-6">
								<div>
									<div className="mb-2 flex items-start justify-between">
										<h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
										<Badge
											className={
												product.status === "active"
													? "bg-green-100 text-green-800"
													: product.status === "draft"
														? "bg-yellow-100 text-yellow-800"
														: "bg-gray-100 text-gray-800"
											}
										>
											{product.status}
										</Badge>
									</div>

									<div className="mb-4 flex items-center gap-4">
										<div className="flex items-center gap-1">
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											<Star className="h-4 w-4 fill-gray-200 text-gray-200" />
											<span className="ml-1 text-sm text-gray-600">(4.0)</span>
										</div>
										<span className="text-sm text-gray-600">
											{product.inventory > 0 ? `${product.inventory} trong kho` : "Hết hàng"}
										</span>
									</div>

									<div className="mb-4 text-3xl font-bold text-gray-900">${product.price}</div>

									{product.categories.length > 0 && (
										<div className="mb-4 flex flex-wrap gap-2">
											{product.categories.map((category) => (
												<Badge key={category} variant="secondary">
													{category}
												</Badge>
											))}
										</div>
									)}
								</div>

								<Separator />

								<div>
									<h3 className="mb-2 font-semibold text-gray-900">Mô tả</h3>
									<div
										className="prose prose-sm max-w-none text-gray-600"
										dangerouslySetInnerHTML={{ __html: product.description }}
									/>
								</div>

								{product.variations.length > 0 && (
									<>
										<Separator />
										<div className="space-y-4">
											{product.variations.map((variation) => (
												<div key={variation.id}>
													<h4 className="mb-2 font-medium text-gray-900">{variation.name}</h4>
													<div className="grid grid-cols-2 gap-2">
														{variation.options.map((option) => (
															<Card
																key={option.id}
																className="cursor-pointer transition-shadow hover:shadow-md"
															>
																<CardContent className="flex flex-col items-center p-3">
																	<div className="font-medium">{option.value}</div>
																	<div className="text-sm text-gray-600">
																		${option.price} • {option.inventory} có sẵn
																	</div>
																</CardContent>
															</Card>
														))}
													</div>
												</div>
											))}
										</div>
									</>
								)}

								<Separator />

								<div className="space-y-3">
									<Button className="w-full" size="lg">
										<ShoppingCart className="mr-2 h-4 w-4" />
										Thêm vào giỏ hàng
									</Button>
									<Button variant="outline" className="w-full bg-transparent" size="lg">
										Liên hệ để báo giá
									</Button>
								</div>

								<div className="space-y-1 text-xs text-gray-500">
									<p>✓ Tư vấn miễn phí</p>
									<p>✓ Đảm bảo hoàn tiền trong 30 ngày</p>
									<p>✓ Hỗ trợ khách hàng 24/7</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
