"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import TicketForm from "./ticket-form";
import TicketHistory from "./ticket-history";
import { Plus, History, MessageSquare } from "lucide-react";
import { motion } from "motion/react";

export default function TicketsMain() {
	const [activeTab, setActiveTab] = useState("history");

	return (
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
	);
}
