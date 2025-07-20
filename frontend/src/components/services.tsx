"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Apple, Facebook, Youtube, Shield, Clock, Headphones } from "lucide-react";
import { motion } from "motion/react";

export default function Services() {
	const services = [
		{
			icon: Apple,
			title: "Apple ID Services",
			description:
				"Professional Apple ID setup and management with enhanced security features and region optimization.",
			features: ["Secure Setup", "Region Optimization", "2FA Configuration", "Recovery Setup"],
			price: "From $29",
			popular: false,
		},
		{
			icon: Facebook,
			title: "Social Media Management",
			description: "Complete Facebook account setup and management services for businesses and individuals.",
			features: ["Account Setup", "Privacy Configuration", "Business Integration", "Security Audit"],
			price: "From $39",
			popular: true,
		},
		{
			icon: Youtube,
			title: "YouTube Premium Setup",
			description: "YouTube Premium subscription management and family plan optimization services.",
			features: ["Premium Setup", "Family Plans", "Music Integration", "Ad-Free Experience"],
			price: "From $19",
			popular: false,
		},
	];

	return (
		<section id="services" className="bg-color-100 py-20 transition-colors">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="mb-16 space-y-4 text-center"
				>
					<h2 className="md:text-4x text-3xl font-bold text-gray-900">Our Premium Services</h2>
					<p className="mx-auto max-w-3xl text-xl text-gray-600">
						Professional digital services designed to enhance your online experience with security,
						reliability, and expert support.
					</p>
				</motion.div>

				<div className="grid gap-8 md:grid-cols-3">
					{services.map((service, index) => (
						<motion.div
							key={service.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
						>
							<Card
								className={`relative h-full transition-all duration-300 hover:shadow-xl ${
									service.popular ? "scale-105 ring-2 ring-blue-600" : ""
								}`}
							>
								{service.popular && (
									<Badge className="absolute -top-3 left-1/2 -translate-x-1/2 transform bg-blue-600">
										Most Popular
									</Badge>
								)}
								<CardHeader className="pb-4 text-center">
									<div className="mx-auto mb-4 w-fit rounded-full bg-blue-100 p-3">
										<service.icon className="h-8 w-8 text-blue-600" />
									</div>
									<CardTitle className="text-xl font-bold text-gray-900">{service.title}</CardTitle>
									<CardDescription className="text-gray-600">{service.description}</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="space-y-3">
										{service.features.map((feature) => (
											<div key={feature} className="flex items-center space-x-2">
												<div className="h-2 w-2 rounded-full bg-blue-600"></div>
												<span className="text-sm text-gray-700">{feature}</span>
											</div>
										))}
									</div>
									<div className="border-t border-gray-200 pt-4">
										<div className="mb-4 text-2xl font-bold text-gray-900">{service.price}</div>
										<Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					viewport={{ once: true }}
					className="mt-16 grid gap-8 md:grid-cols-3"
				>
					<div className="space-y-3 text-center">
						<Shield className="mx-auto h-12 w-12 text-blue-600" />
						<h3 className="text-lg font-semibold text-gray-900">100% Secure</h3>
						<p className="text-gray-600">All services are performed with the highest security standards</p>
					</div>
					<div className="space-y-3 text-center">
						<Clock className="mx-auto h-12 w-12 text-blue-600" />
						<h3 className="text-gray-90 text-lg font-semibold">Fast Delivery</h3>
						<p className="text-gray-600">Most services completed within 24 hours</p>
					</div>
					<div className="space-y-3 text-center">
						<Headphones className="mx-auto h-12 w-12 text-blue-600" />
						<h3 className="text-gray-90 text-lg font-semibold">24/7 Support</h3>
						<p className="text-gray-600">Round-the-clock customer support for all clients</p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
