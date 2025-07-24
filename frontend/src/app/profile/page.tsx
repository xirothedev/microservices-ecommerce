"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserQuery } from "@/hooks/use-user";
import { UserQuery } from "@/typings/backend";
import dayjs from "dayjs";
import { Edit, Loader2, Save, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function PersonalInformation() {
	const [isEditing, setIsEditing] = useState(false);
	const { data } = useUserQuery();
	const [formData, setFormData] = useState<UserQuery | undefined>();

	useEffect(() => {
		if (data?.me) {
			setFormData(data.me);
		}
	}, [data]);

	if (!formData) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-blue-500" />
			</div>
		);
	}

	const handleSave = () => {
		// Here you would typically make an API call to save the data
		console.log("Saving data:", formData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		// Reset form data to original values
		setIsEditing(false);
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Personal Information</CardTitle>
						<CardDescription>Manage your personal details and contact information</CardDescription>
					</div>
					<Button
						variant={isEditing ? "outline" : "default"}
						onClick={() => setIsEditing(!isEditing)}
						className="flex items-center gap-2"
					>
						{isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
						{isEditing ? "Cancel" : "Edit"}
					</Button>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Profile Picture Section */}
					<div className="flex items-center space-x-4">
						<Avatar className="h-24 w-24">
							<AvatarImage
								src={
									data?.me.avatarUrl ??
									"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=96&width=96"
								}
								alt="Profile"
							/>
							<AvatarFallback className="text-2xl">JD</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Profile Picture</h3>
								<Badge variant="secondary">Premium</Badge>
							</div>
							<p className="text-sm text-gray-600">Upload a new profile picture</p>
							{isEditing && (
								<Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
									<Upload className="h-4 w-4" />
									Upload New Photo
								</Button>
							)}
						</div>
					</div>

					{/* Form Fields */}
					<form className="grid gap-6 md:grid-cols-2">
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="fullname">Full name</Label>
							<Input
								id="fullname"
								value={formData.fullname}
								onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
								disabled={!isEditing}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								disabled={!isEditing}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="phone">Phone Number</Label>
							<Input
								id="phone"
								value={formData.phone ?? ""}
								onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
								disabled={!isEditing}
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="address">Address</Label>
							<Input
								id="address"
								value={formData.address ?? ""}
								onChange={(e) => setFormData({ ...formData, address: e.target.value })}
								disabled={!isEditing}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="city">City</Label>
							<Input
								id="city"
								value={formData.city ?? ""}
								onChange={(e) => setFormData({ ...formData, city: e.target.value })}
								disabled={!isEditing}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="state">State</Label>
							<Input
								id="state"
								value={formData.state ?? ""}
								onChange={(e) => setFormData({ ...formData, state: e.target.value })}
								disabled={!isEditing}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="zipCode">ZIP Code</Label>
							<Input
								id="zipCode"
								value={formData.zipCode ?? ""}
								onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
								disabled={!isEditing}
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="biography">Biography</Label>
							<Textarea
								id="biography"
								value={formData.biography ?? ""}
								onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
								disabled={!isEditing}
								rows={3}
							/>
						</div>
					</form>

					{/* Save Button */}
					{isEditing && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex justify-end space-x-2"
						>
							<Button variant="outline" onClick={handleCancel}>
								Cancel
							</Button>
							<Button onClick={handleSave} className="flex items-center gap-2">
								<Save className="h-4 w-4" />
								Save Changes
							</Button>
						</motion.div>
					)}
				</CardContent>
			</Card>

			{/* Account Status Card */}
			<Card>
				<CardHeader>
					<CardTitle>Account Status</CardTitle>
					<CardDescription>Your account information and membership details</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="rounded-lg bg-blue-50 p-4 text-center">
							<div className="text-2xl font-bold text-blue-600">Premium</div>
							<div className="text-sm text-gray-600">Account Type</div>
						</div>
						<div className="rounded-lg bg-green-50 p-4 text-center">
							<div className="text-2xl font-bold text-green-600">Active</div>
							<div className="text-sm text-gray-600">Status</div>
						</div>
						<div className="rounded-lg bg-purple-50 p-4 text-center">
							<div className="text-2xl font-bold text-purple-600">
								{data?.me.createAt ? dayjs(data.me.createAt).format("MMM YYYY") : ""}
							</div>
							<div className="text-sm text-gray-600">Member Since</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
