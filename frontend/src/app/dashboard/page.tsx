"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Ticket, BarChart3, Settings } from "lucide-react";
import DashboardOverview from "@/app/dashboard/components/dashboard-overview";
import UserManagement from "@/app/dashboard/components/user-management";
import TicketManagement from "@/app/dashboard/components/ticket-management";

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState("overview");

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển quản trị</h1>
					<p className="mt-2 text-gray-600">Quản lý người dùng, phiếu hỗ trợ và hoạt động hệ thống</p>
				</div>

				{/* Dashboard Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
						<TabsTrigger value="overview" className="flex items-center gap-2">
							<BarChart3 className="h-4 w-4" />
							<span className="hidden sm:inline">Tổng quan</span>
						</TabsTrigger>
						<TabsTrigger value="users" className="flex items-center gap-2">
							<Users className="h-4 w-4" />
							<span className="hidden sm:inline">Người dùng</span>
						</TabsTrigger>
						<TabsTrigger value="tickets" className="flex items-center gap-2">
							<Ticket className="h-4 w-4" />
							<span className="hidden sm:inline">Phiếu hỗ trợ</span>
						</TabsTrigger>
						<TabsTrigger value="settings" className="flex items-center gap-2">
							<Settings className="h-4 w-4" />
							<span className="hidden sm:inline">Cài đặt</span>
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
								<CardTitle>Cài đặt hệ thống</CardTitle>
								<CardDescription>Cấu hình cài đặt và tùy chọn toàn hệ thống</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="py-12 text-center">
									<Settings className="mx-auto mb-4 h-12 w-12 text-gray-400" />
									<p className="text-gray-600">Bảng cài đặt hệ thống sẽ sớm có...</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
