"use client";

import { LiveChatContext } from "@/app/template";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useContext } from "react";

export default function Contact() {
	const { setIsOpen } = useContext(LiveChatContext);

	return (
		<section id="contact" className="bg-gradient-to-br from-blue-50 to-purple-50 py-20 transition-colors">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="mb-16 space-y-4 text-center"
				>
					<h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Ready to Get Started?</h2>
					<p className="mx-auto max-w-3xl text-xl text-gray-600">
						Contact us today to discuss your digital service needs. Our team is ready to help you achieve
						your goals with professional, secure solutions.
					</p>
				</motion.div>

				<div className="grid gap-12 lg:grid-cols-2">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="space-y-8"
					>
						<Card>
							<CardHeader>
								<CardTitle className="text-gray-900">Send us a Message</CardTitle>
								<CardDescription className="text-gray-600">
									Fill out the form below and we&apos;ll get back to you within 24 hours.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 md:grid-cols-2">
									<Input placeholder="First Name" />
									<Input placeholder="Last Name" />
								</div>
								<Input placeholder="Email Address" type="email" />
								<Input placeholder="Phone Number" type="tel" />
								<Textarea placeholder="Tell us about your project..." className="min-h-[120px]" />
								<Button className="w-full bg-blue-600 hover:bg-blue-700">
									Send Message
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
						className="space-y-8"
					>
						<div className="space-y-6">
							<h3 className="text-2xl font-bold text-gray-900">Get in Touch</h3>
							<p className="leading-relaxed text-gray-600">
								We&apos;re here to help you with all your digital service needs. Whether you have
								questions about our services or need a custom solution, our team is ready to assist.
							</p>
						</div>

						<div className="space-y-6">
							<div className="flex items-center space-x-4">
								<div className="rounded-full bg-blue-100 p-3">
									<Mail className="h-6 w-6 text-blue-600" />
								</div>
								<div>
									<div className="font-semibold text-gray-900">Email Us</div>
									<div className="text-gray-600">support@digitalpro.com</div>
								</div>
							</div>

							<div className="flex items-center space-x-4">
								<div className="rounded-full bg-blue-100 p-3">
									<Phone className="h-6 w-6 text-blue-600" />
								</div>
								<div>
									<div className="font-semibold text-gray-900">Call Us</div>
									<div className="text-gray-600">+1 (555) 123-4567</div>
								</div>
							</div>

							<div className="flex items-center space-x-4">
								<div className="rounded-full bg-blue-100 p-3">
									<MessageCircle className="h-6 w-6 text-blue-600" />
								</div>
								<div>
									<div className="font-semibold text-gray-900">Live Chat</div>
									<div className="text-gray-600">Available 24/7</div>
								</div>
							</div>
						</div>

						<Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
							<CardContent className="p-6">
								<h4 className="mb-2 text-lg font-semibold">Need Immediate Help?</h4>
								<p className="mb-4 text-blue-100">
									Our support team is available 24/7 to assist with urgent requests.
								</p>
								<Button
									onClick={() => setIsOpen(true)}
									variant="secondary"
									className="bg-white text-blue-600 hover:bg-gray-100"
								>
									Start Live Chat
								</Button>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
