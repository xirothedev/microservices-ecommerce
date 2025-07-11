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
import { Skeleton } from "@/components/ui/skeleton";
import UserTable from "./user-table";

export interface User {
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
	const [loading, setLoading] = useState<boolean>(false);

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

			<UserTable
				setIsProfileModalOpen={setIsProfileModalOpen}
				setSelectedUser={setSelectedUser}
				handleAdjustCredits={handleAdjustCredits}
				handleBanUser={handleBanUser}
				handleDeleteUser={handleDeleteUser}
				filteredUsers={filteredUsers}
				loading={loading}
			/>

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
