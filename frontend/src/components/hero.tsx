"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Users } from "lucide-react"
import { motion } from "motion/react"
import ShinyText from "./ui/shiny-text";
import { TextEffectWrapper } from "./ui/text-effect-wrapper";
import Link from "next/link";

export default function Hero() {
  return (
		<section id="home" className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 transition-colors">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="space-y-8"
					>
						<div className="space-y-4">
							<h1 className="text-4xl leading-tight font-bold text-gray-900 md:text-6xl">
								Premium Digital
								<ShinyText speedInMs={3000} className="w-fit">
									Services
								</ShinyText>
								{/* <span className="text-blue-600"> Services</span> */}
								<br />
								Made Simple
							</h1>
							<TextEffectWrapper
								per="char"
								preset="slide"
								className="text-lg leading-relaxed text-gray-600"
							>
								Professional setup and management of your digital accounts. Secure, reliable, and
								trusted by thousands of customers worldwide.
							</TextEffectWrapper>
						</div>

						<div className="flex flex-col gap-4 sm:flex-row">
							<Button size="lg" className="group bg-blue-600 px-8 py-3 text-lg hover:bg-blue-700">
								<Link className="flex items-center" href="https://www.facebook.com/xirothedev/">
									Contact now
									<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-gray-300 bg-transparent px-8 py-3 text-lg text-gray-900 hover:bg-gray-100"
							>
								<Link href="/services">View Services</Link>
							</Button>
						</div>

						<div className="flex items-center space-x-8 pt-8">
							<div className="flex items-center space-x-2">
								<Shield className="h-6 w-6 text-green-600" />
								<span className="text-sm font-medium text-gray-700">100% Secure</span>
							</div>
							<div className="flex items-center space-x-2">
								<Zap className="h-6 w-6 text-yellow-600" />
								<span className="text-sm font-medium text-gray-700">Instant Setup</span>
							</div>
							<div className="flex items-center space-x-2">
								<Users className="h-6 w-6 text-blue-600" />
								<span className="text-sm font-medium text-gray-700">24/7 Support</span>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="relative"
					>
						<div className="relative rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 shadow-2xl">
							<div className="grid grid-cols-2 gap-4">
								<div className="rounded-lg bg-white/10 p-4 text-white backdrop-blur-sm">
									<div className="text-2xl font-bold">10K+</div>
									<div className="text-sm opacity-90">Happy Customers</div>
								</div>
								<div className="rounded-lg bg-white/10 p-4 text-white backdrop-blur-sm">
									<div className="text-2xl font-bold">99.9%</div>
									<div className="text-sm opacity-90">Success Rate</div>
								</div>
								<div className="rounded-lg bg-white/10 p-4 text-white backdrop-blur-sm">
									<div className="text-2xl font-bold">24/7</div>
									<div className="text-sm opacity-90">Support</div>
								</div>
								<div className="rounded-lg bg-white/10 p-4 text-white backdrop-blur-sm">
									<div className="text-2xl font-bold">5★</div>
									<div className="text-sm opacity-90">Rating</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
  );
}
