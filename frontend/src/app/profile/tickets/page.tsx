"use client";

import TicketForm from "@/components/profile/ticket/ticket-form";
import TicketHistory from "@/components/profile/ticket/ticket-history";
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
		<div>
			<div className="mb-8 space-y-6">
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

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<div className="flex items-center justify-between">
						<TabsList className="grid w-full max-w-md grid-cols-2">
							<TabsTrigger value="history" className="flex items-center gap-2">
								<History className="h-4 w-4" />
								Ticket History
							</TabsTrigger>
							<TabsTrigger value="new" className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								New Ticket
							</TabsTrigger>
						</TabsList>

						<div className="flex items-center gap-2">
							<Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
								<MessageSquare className="mr-1 h-3 w-3" />
								Live Chat Available
							</Badge>
						</div>
					</div>

					<TabsContent value="history" className="space-y-6">
						<TicketHistory />
					</TabsContent>

					<TabsContent value="new" className="space-y-6">
						<TicketForm />
					</TabsContent>
				</Tabs>
			</motion.div>
		</div>
	);
}
