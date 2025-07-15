"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Settings, Ticket, Users } from "lucide-react";
import { useState } from "react";
import DashboardOverview from "./dashboard-overview";
import TicketManagement from "./ticket-management";
import UserManagement from "./user-management";

export default function DashboardLayout() {
	const [activeTab, setActiveTab] = useState("overview");

	return (
		<div className="min-h-screen bg-gray-50 pt-20">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
					<p className="mt-2 text-gray-600">Manage users, support tickets, and system operations</p>
				</div>

				{/* Dashboard Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
						<TabsTrigger value="overview" className="flex items-center gap-2">
							<BarChart3 className="h-4 w-4" />
							<span className="hidden sm:inline">Overview</span>
						</TabsTrigger>
						<TabsTrigger value="users" className="flex items-center gap-2">
							<Users className="h-4 w-4" />
							<span className="hidden sm:inline">Users</span>
						</TabsTrigger>
						<TabsTrigger value="tickets" className="flex items-center gap-2">
							<Ticket className="h-4 w-4" />
							<span className="hidden sm:inline">Tickets</span>
						</TabsTrigger>
						<TabsTrigger value="settings" className="flex items-center gap-2">
							<Settings className="h-4 w-4" />
							<span className="hidden sm:inline">Settings</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6">
						<DashboardOverview />
					</TabsContent>

					<TabsContent value="users" className="space-y-6">
						<UserManagement />
					</TabsContent>

					<TabsContent value="tickets" className="space-y-6">
						<TicketManagement />
					</TabsContent>

					<TabsContent value="settings" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>System Settings</CardTitle>
								<CardDescription>Configure system-wide settings and preferences</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="py-12 text-center">
									<Settings className="mx-auto mb-4 h-12 w-12 text-gray-400" />
									<p className="text-gray-600">System settings panel coming soon...</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
