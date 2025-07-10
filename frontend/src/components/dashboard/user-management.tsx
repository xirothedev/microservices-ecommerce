"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ban, DollarSign, Eye, Mail, MoreHorizontal, Phone, Search, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import UserProfileModal from "./user-profile-modal";

interface User {
	id: string;
	name: string;
	email: string;
	phone?: string;
	avatar: string;
	status: "active" | "inactive" | "banned";
	credits: number;
	joinDate: string;
	lastActivity: string;
	totalOrders: number;
	totalSpent: number;
	role: "user" | "premium" | "admin";
}

const mockUsers: User[] = [
	{
		id: "1",
		name: "John Doe",
		email: "john.doe@example.com",
		phone: "+1 (555) 123-4567",
		avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=40&width=40",
		status: "active",
		credits: 150.0,
		joinDate: "2024-01-10T00:00:00Z",
		lastActivity: "2024-01-15T14:30:00Z",
		totalOrders: 5,
		totalSpent: 249.95,
		role: "premium",
	},
	{
		id: "2",
		name: "Alice Johnson",
		email: "alice.johnson@example.com",
		avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=40&width=40",
		status: "active",
		credits: 75.5,
		joinDate: "2024-01-08T00:00:00Z",
		lastActivity: "2024-01-15T12:15:00Z",
		totalOrders: 3,
		totalSpent: 149.97,
		role: "user",
	},
	{
		id: "3",
		name: "Bob Smith",
		email: "bob.smith@example.com",
		phone: "+1 (555) 987-6543",
		avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=40&width=40",
		status: "inactive",
		credits: 0.0,
		joinDate: "2024-01-05T00:00:00Z",
		lastActivity: "2024-01-12T09:45:00Z",
		totalOrders: 1,
		totalSpent: 49.99,
		role: "user",
	},
	{
		id: "4",
		name: "Carol Davis",
		email: "carol.davis@example.com",
		avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=40&width=40",
		status: "banned",
		credits: 25.0,
		joinDate: "2024-01-03T00:00:00Z",
		lastActivity: "2024-01-10T16:20:00Z",
		totalOrders: 2,
		totalSpent: 99.98,
		role: "user",
	},
	{
		id: "5",
		name: "David Wilson",
		email: "david.wilson@example.com",
		phone: "+1 (555) 456-7890",
		avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=40&width=40",
		status: "active",
		credits: 300.0,
		joinDate: "2023-12-28T00:00:00Z",
		lastActivity: "2024-01-15T11:30:00Z",
		totalOrders: 8,
		totalSpent: 399.92,
		role: "premium",
	},
];

export default function UserManagement() {
	const [users, setUsers] = useState<User[]>(mockUsers);
	const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let filtered = users;

		// Apply search filter
		if (searchTerm) {
			filtered = filtered.filter(
				(user) =>
					user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.email.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		}

		// Apply status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter((user) => user.status === statusFilter);
		}

		// Apply role filter
		if (roleFilter !== "all") {
			filtered = filtered.filter((user) => user.role === roleFilter);
		}

		setFilteredUsers(filtered);
	}, [users, searchTerm, statusFilter, roleFilter]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

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

	const handleViewProfile = (user: User) => {
		setSelectedUser(user);
		setIsProfileModalOpen(true);
	};

	const handleBanUser = async (userId: string) => {
		setLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setUsers((prev) =>
			prev.map((user) =>
				user.id === userId
					? { ...user, status: user.status === "banned" ? "active" : ("banned" as const) }
					: user,
			),
		);
		setLoading(false);
	};

	const handleDeleteUser = async (userId: string) => {
		if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
			return;
		}

		setLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setUsers((prev) => prev.filter((user) => user.id !== userId));
		setLoading(false);
	};

	const handleAdjustCredits = async (userId: string, newCredits: number) => {
		setLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, credits: newCredits } : user)));
		setLoading(false);
	};

	return (
		<div className="space-y-6">
			{/* Header and Filters */}
			<Card>
				<CardHeader>
					<CardTitle>User Management</CardTitle>
					<CardDescription>Manage user accounts, view profiles, and adjust user settings</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="relative flex-1">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							<Input
								placeholder="Search users by name or email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
								<SelectItem value="banned">Banned</SelectItem>
							</SelectContent>
						</Select>
						<Select value={roleFilter} onValueChange={setRoleFilter}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Filter by role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Roles</SelectItem>
								<SelectItem value="user">User</SelectItem>
								<SelectItem value="premium">Premium</SelectItem>
								<SelectItem value="admin">Admin</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Users Table */}
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
										<TableCell>
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
										<TableCell className="text-sm text-gray-600">
											{formatDate(user.joinDate)}
										</TableCell>
										<TableCell className="text-sm text-gray-600">
											{formatDate(user.lastActivity)}
										</TableCell>
										<TableCell className="text-right">
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
															user.status === "banned"
																? "text-green-600"
																: "text-orange-600"
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

					{filteredUsers.length === 0 && (
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

			{/* User Profile Modal */}
			<UserProfileModal
				user={selectedUser}
				isOpen={isProfileModalOpen}
				onClose={() => {
					setIsProfileModalOpen(false);
					setSelectedUser(null);
				}}
				onAdjustCredits={handleAdjustCredits}
				onBanUser={handleBanUser}
				onDeleteUser={handleDeleteUser}
			/>
		</div>
	);
}
