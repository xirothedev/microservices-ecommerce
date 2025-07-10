"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function ServicesHero() {
	const scrollToServices = () => {
		const servicesSection = document.querySelector("#services-list");
		servicesSection?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
			<div className="absolute inset-0 bg-black/20" />
			<div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-8 text-center"
				>
					<Badge className="border-white/30 bg-white/20 text-white backdrop-blur-sm">
						<Sparkles className="mr-2 h-4 w-4" />
						Premium Digital Services
					</Badge>

					<div className="space-y-4">
						<h1 className="text-4xl leading-tight font-bold md:text-6xl">
							Explore Our
							<span className="block text-yellow-300">Digital Solutions</span>
						</h1>
						<p className="mx-auto max-w-3xl text-xl leading-relaxed text-blue-100 md:text-2xl">
							Discover our comprehensive range of professional digital services designed to enhance your
							online presence and streamline your digital experience.
						</p>
					</div>

					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button
							size="lg"
							className="bg-white px-8 py-3 text-lg text-blue-600 hover:bg-gray-100"
							onClick={scrollToServices}
						>
							Browse Services
							<ArrowDown className="ml-2 h-5 w-5" />
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-white bg-transparent px-8 py-3 text-lg text-white hover:bg-white hover:text-blue-600"
						>
							Custom Quote
						</Button>
					</div>

					<div className="grid grid-cols-2 gap-8 pt-12 md:grid-cols-4">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center"
						>
							<div className="text-3xl font-bold">50+</div>
							<div className="text-blue-200">Services Available</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="text-center"
						>
							<div className="text-3xl font-bold">24h</div>
							<div className="text-blue-200">Average Delivery</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="text-center"
						>
							<div className="text-3xl font-bold">99.9%</div>
							<div className="text-blue-200">Success Rate</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.5 }}
							className="text-center"
						>
							<div className="text-3xl font-bold">24/7</div>
							<div className="text-blue-200">Support</div>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
