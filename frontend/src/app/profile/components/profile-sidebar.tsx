"use client";

import { CreditCard, HelpCircle, ListOrdered, Lock, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

const userData = {
	name: "John Doe",
	email: "john.doe@example.com",
	avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=80&width=80",
	memberSince: "January 2023",
	accountType: "Premium",
	totalOrders: 24,
	totalSpent: 1250,
};

const navigationItems = [
	{
		url: "",
		label: "Personal Information",
		icon: User,
		description: "Manage your profile details",
	},
	{
		url: "orders",
		label: "Orders History",
		icon: ListOrdered,
		description: "View your orders history",
	},
	{
		url: "transaction",
		label: "Transaction History",
		icon: CreditCard,
		description: "View your payment history",
	},
	{
		url: "change-password",
		label: "Change Password",
		icon: Lock,
		description: "Update your security",
	},
	{
		url: "tickets",
		label: "Support Tickets",
		icon: HelpCircle,
		description: "Get help and support",
	},
	{
		url: "settings",
		label: "Account Settings",
		icon: Settings,
		description: "Manage preferences",
	},
];

interface ProfileSidebarProps {
	setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ProfileSidebar({ setSidebarOpen }: ProfileSidebarProps) {
	const path = usePathname();

	const activePage = path.split("/")[2] ?? "";
	console.log(activePage);

	return (
		<Card className="sticky top-24 h-fit">
			<CardContent className="p-6">
				{/* User Profile Header */}
				<div className="mb-6 text-center">
					<Avatar className="mx-auto mb-4 h-20 w-20">
						<AvatarImage
							src={
								userData.avatar ||
								"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
							}
							alt={userData.name}
						/>
						<AvatarFallback className="text-lg">
							{userData.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
					<h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
					<p className="mb-2 text-sm text-gray-600">{userData.email}</p>
					<Badge variant="secondary" className="bg-blue-100 text-blue-800">
						{userData.accountType}
					</Badge>
				</div>

				{/* Quick Stats */}
				<div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-900">{userData.totalOrders}</div>
						<div className="text-xs text-gray-600">Total Orders</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-900">${userData.totalSpent}</div>
						<div className="text-xs text-gray-600">Total Spent</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="space-y-2">
					{navigationItems.map((item) => (
						<Button
							key={item.url}
							variant={activePage === item.url ? "default" : "ghost"}
							className={`h-auto w-full justify-start p-3 ${
								activePage === item.url ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
							}`}
							onClick={() => setSidebarOpen(false)}
						>
							<Link className="flex items-center" href={`/profile/${item.url}`}>
								<item.icon className="mr-3 h-5 w-5" />
								<div className="text-left">
									<div className="font-medium">{item.label}</div>
									<div className="text-xs opacity-75">{item.description}</div>
								</div>
							</Link>
						</Button>
					))}
				</nav>

				{/* Logout Button */}
				<div className="mt-6 border-t pt-6">
					<Button
						variant="outline"
						className="w-full justify-start bg-transparent text-red-600 hover:bg-red-50"
					>
						<LogOut className="mr-3 h-5 w-5" />
						Sign Out
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
