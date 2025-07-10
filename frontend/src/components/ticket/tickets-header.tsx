"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Clock, Users, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export default function TicketsHeader() {
	const stats = [
		{
			icon: Clock,
			label: "Avg Response Time",
			value: "< 2 hours",
			color: "text-blue-600",
		},
		{
			icon: Users,
			label: "Support Agents",
			value: "24/7",
			color: "text-green-600",
		},
		{
			icon: CheckCircle,
			label: "Resolution Rate",
			value: "98.5%",
			color: "text-purple-600",
		},
	];

	return (
		<div className="mb-8 space-y-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="space-y-4 text-center"
			>
				<div className="mb-2 flex items-center justify-center gap-2">
					<MessageCircle className="h-8 w-8 text-blue-600" />
					<h1 className="text-3xl font-bold text-gray-900">Submit Support Ticket</h1>
				</div>
				<p className="mx-auto max-w-2xl text-lg text-gray-600">
					Need help? Submit a detailed support ticket and our expert team will assist you promptly. Include
					screenshots, reference your orders, and provide context for faster resolution.
				</p>
				<Badge variant="secondary" className="bg-blue-100 text-blue-800">
					Priority Support Available
				</Badge>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<Card>
					<CardContent className="p-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							{stats.map((stat, index) => (
								<div key={index} className="text-center">
									<div className="mb-2 flex items-center justify-center">
										<stat.icon className={`h-6 w-6 ${stat.color}`} />
									</div>
									<div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
									<div className="text-sm text-gray-600">{stat.label}</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
