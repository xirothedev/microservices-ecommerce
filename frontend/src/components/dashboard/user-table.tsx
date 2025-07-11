"use client";

import { formatCurrency, formatDate } from "@/lib/format";
import { Ban, DollarSign, Eye, Mail, MoreHorizontal, Phone, Search, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Dispatch, SetStateAction } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { User } from "./user-management";

interface UserTableProps {
	setIsProfileModalOpen: Dispatch<SetStateAction<boolean>>;
	setSelectedUser: Dispatch<SetStateAction<User | null>>;
	handleAdjustCredits: (userId: string, newCredits: number) => void;
	handleBanUser: (userId: string) => void;
	handleDeleteUser: (userId: string) => void;
	filteredUsers: User[];
	loading: boolean;
}

const getStatusBadge = (status: string) => {
	switch (status) {
		case "active":
			return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
		case "inactive":
			return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Inactive</Badge>;
		case "banned":
			return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Banned</Badge>;
		default:
			return <Badge variant="secondary">{status}</Badge>;
	}
};

const getRoleBadge = (role: string) => {
	switch (role) {
		case "admin":
			return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>;
		case "premium":
			return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Premium</Badge>;
		case "user":
			return <Badge variant="outline">User</Badge>;
		default:
			return <Badge variant="secondary">{role}</Badge>;
	}
};

export default function UserTable({
	setSelectedUser,
	setIsProfileModalOpen,
	handleAdjustCredits,
	handleBanUser,
	handleDeleteUser,
	loading,
	filteredUsers,
}: UserTableProps) {
	const handleViewProfile = (user: User) => {
		setSelectedUser(user);
		setIsProfileModalOpen(true);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Users ({filteredUsers.length})</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Credits</TableHead>
								<TableHead>Orders</TableHead>
								<TableHead>Total Spent</TableHead>
								<TableHead>Join Date</TableHead>
								<TableHead>Last Activity</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.map((user, index) => (
								<motion.tr
									key={user.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
									className="hover:bg-gray-50"
								>
									<TableCell className="rounded-l-xl">
										<div className="flex items-center gap-3">
											<Avatar className="h-10 w-10">
												<AvatarImage
													src={
														user.avatar ||
														"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
													}
												/>
												<AvatarFallback>
													{user.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-medium">{user.name}</div>
												<div className="flex items-center gap-1 text-sm text-gray-600">
													<Mail className="h-3 w-3" />
													{user.email}
												</div>
												{user.phone && (
													<div className="flex items-center gap-1 text-sm text-gray-600">
														<Phone className="h-3 w-3" />
														{user.phone}
													</div>
												)}
											</div>
										</div>
									</TableCell>
									<TableCell>{getStatusBadge(user.status)}</TableCell>
									<TableCell>{getRoleBadge(user.role)}</TableCell>
									<TableCell className="font-medium">{formatCurrency(user.credits)}</TableCell>
									<TableCell>{user.totalOrders}</TableCell>
									<TableCell className="font-medium">{formatCurrency(user.totalSpent)}</TableCell>
									<TableCell className="text-sm text-gray-600">{formatDate(user.joinDate)}</TableCell>
									<TableCell className="text-sm text-gray-600">
										{formatDate(user.lastActivity)}
									</TableCell>
									<TableCell className="text-right rounded-r-xl">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem onClick={() => handleViewProfile(user)}>
													<Eye className="mr-2 h-4 w-4" />
													View Profile
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														const newCredits = prompt(
															`Enter new credit amount for ${user.name}:`,
															user.credits.toString(),
														);
														if (newCredits && !isNaN(Number(newCredits))) {
															handleAdjustCredits(user.id, Number(newCredits));
														}
													}}
												>
													<DollarSign className="mr-2 h-4 w-4" />
													Adjust Credits
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => handleBanUser(user.id)}
													className={
														user.status === "banned" ? "text-green-600" : "text-orange-600"
													}
												>
													<Ban className="mr-2 h-4 w-4" />
													{user.status === "banned" ? "Unban User" : "Ban User"}
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleDeleteUser(user.id)}
													className="text-red-600"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Delete User
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</motion.tr>
							))}
						</TableBody>
					</Table>
				</div>
				{filteredUsers.length === 0 && !loading && (
					<div className="py-12 text-center">
						<div className="mb-4 text-gray-400">
							<Search className="mx-auto h-12 w-12" />
						</div>
						<h3 className="mb-2 text-lg font-medium text-gray-900">No users found</h3>
						<p className="text-gray-600">Try adjusting your search criteria or filters.</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
