"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { motion } from "motion/react";

export default function Testimonials() {
	const testimonials = [
		{
			name: "Sarah Johnson",
			role: "Small Business Owner",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=40&width=40",
			rating: 5,
			content:
				"DigitalPro made setting up my business social media accounts incredibly easy. Their team was professional and the results exceeded my expectations.",
		},
		{
			name: "Michael Chen",
			role: "Content Creator",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=40&width=40",
			rating: 5,
			content:
				"The YouTube Premium setup service saved me hours of configuration. Everything works perfectly and their support team is always available.",
		},
		{
			name: "Emily Rodriguez",
			role: "Marketing Manager",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=40&width=40",
			rating: 5,
			content:
				"Outstanding service! They helped optimize all our digital accounts with top-notch security. Highly recommend for any business.",
		},
		{
			name: "David Thompson",
			role: "Entrepreneur",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=40&width=40",
			rating: 5,
			content:
				"Professional, reliable, and fast. DigitalPro delivered exactly what they promised. Will definitely use their services again.",
		},
		{
			name: "Lisa Wang",
			role: "Freelancer",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=40&width=40",
			rating: 5,
			content:
				"The Apple ID service was perfect for my international work setup. Great communication throughout the entire process.",
		},
		{
			name: "James Miller",
			role: "Tech Consultant",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=40&width=40",
			rating: 5,
			content:
				"Impressed by their attention to detail and security measures. They truly understand digital account management.",
		},
	];

	return (
		<section id="about" className="bg-white py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="mb-16 space-y-4 text-center"
				>
					<h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Trusted by Thousands</h2>
					<p className="mx-auto max-w-3xl text-xl text-gray-600">
						See what our customers say about our digital services and support.
					</p>
				</motion.div>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
						>
							<Card className="h-full transition-shadow duration-300 hover:shadow-lg">
								<CardContent className="space-y-4 p-6">
									<div className="flex space-x-1">
										{[...Array(testimonial.rating)].map((_, i) => (
											<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
										))}
									</div>
									<p className="leading-relaxed text-gray-700">"{testimonial.content}"</p>
									<div className="flex items-center space-x-3 pt-4">
										<Avatar>
											<AvatarImage
												src={
													testimonial.avatar ||
													"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
												}
												alt={testimonial.name}
											/>
											<AvatarFallback>
												{testimonial.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-semibold text-gray-900">{testimonial.name}</div>
											<div className="text-sm text-gray-600">{testimonial.role}</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
