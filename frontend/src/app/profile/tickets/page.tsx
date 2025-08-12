"use client";

import TicketForm from "@/app/profile/components/ticket/ticket-form";
import TicketHistory from "@/app/profile/components/ticket/ticket-history";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, History, MessageSquare, Plus, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

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

export default function TicketsPage() {
	const [activeTab, setActiveTab] = useState("history");

	return (
		<div className="sm:px-6 lg:px-8">
			<div className="mb-6 space-y-4 sm:mb-8 sm:space-y-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Card>
						<CardContent className="p-4 sm:p-6">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
								{stats.map((stat, index) => (
									<div key={index} className="text-center">
										<div className="mb-2 flex items-center justify-center">
											<stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
										</div>
										<div className={`text-xl font-bold sm:text-2xl ${stat.color}`}>
											{stat.value}
										</div>
										<div className="text-xs text-gray-600 sm:text-sm">{stat.label}</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<TabsList className="grid w-full grid-cols-2 sm:max-w-md">
							<TabsTrigger
								value="history"
								className="flex cursor-pointer items-center gap-1 text-xs sm:gap-2 sm:text-sm"
							>
								<History className="h-3 w-3 sm:h-4 sm:w-4" />
								<span className="hidden sm:inline">Ticket History</span>
								<span className="sm:hidden">History</span>
							</TabsTrigger>
							<TabsTrigger
								value="new"
								className="flex cursor-pointer items-center gap-1 text-xs sm:gap-2 sm:text-sm"
							>
								<Plus className="h-3 w-3 sm:h-4 sm:w-4" />
								<span className="hidden sm:inline">New Ticket</span>
								<span className="sm:hidden">New</span>
							</TabsTrigger>
						</TabsList>

						<div className="flex items-center justify-center sm:justify-end">
							<Badge
								variant="outline"
								className="border-blue-200 bg-blue-50 text-xs text-blue-700 sm:text-sm"
							>
								<MessageSquare className="mr-1 h-3 w-3" />
								<span className="inline">Tin nhắn trực tiếp đang khả dụng</span>
							</Badge>
						</div>
					</div>

					<TabsContent value="history" className="space-y-4 sm:space-y-6">
						<TicketHistory />
					</TabsContent>

					<TabsContent value="new" className="space-y-4 sm:space-y-6">
						<TicketForm />
					</TabsContent>
				</Tabs>
			</motion.div>
		</div>
	);
}
