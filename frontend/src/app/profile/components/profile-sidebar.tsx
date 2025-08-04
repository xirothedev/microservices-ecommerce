"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserQuery } from "@/lib/api/user";
import { getFallbackString } from "@/lib/utils";
import { HelpCircle, ListOrdered, Loader2, Lock, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

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
	const { data } = useUserQuery();
	const activePage = path.split("/")[2] ?? "";

	if (!data) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-blue-500" />
			</div>
		);
	}

	const fallbackAvatar = getFallbackString(data.me.fullname);

	return (
		<Card className="sticky top-24 h-fit">
			<CardContent className="p-6">
				{/* User Profile Header */}
				<div className="mb-6 text-center">
					<Avatar className="mx-auto mb-4 h-20 w-20">
						<AvatarImage
							src={
								data.me.avatarUrl ||
								"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
							}
							alt={data.me.fullname}
						/>
						<AvatarFallback className="text-lg">{fallbackAvatar}</AvatarFallback>
					</Avatar>
					<h2 className="text-xl font-semibold text-gray-900">{data.me.fullname}</h2>
					<p className="mb-2 block truncate text-sm text-gray-600" title={data.me.email}>
						{data.me.email}
					</p>
					<Badge variant="secondary" className="bg-blue-100 text-blue-800">
						Premium
					</Badge>
				</div>

				{/* Quick Stats */}
				<div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-900">100</div>
						<div className="text-xs text-gray-600">Total Orders</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-900">$10000</div>
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
