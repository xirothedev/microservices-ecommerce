"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UpdateUserInput, useUpdateUserAvatarMutation, useUpdateUserMutation, useUserQuery } from "@/hooks/use-user";
import { getFallbackString } from "@/lib/utils";
import { ProfileForm, profileSchema } from "@/zods/user";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Edit, Loader2, Save, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";

export default function PersonalInformation() {
	const [isEditing, setIsEditing] = useState(false);
	const { data } = useUserQuery();
	const { mutateAsync: mutateUpdateUserAvatar } = useUpdateUserAvatarMutation();
	const [mutateUpdateUser] = useUpdateUserMutation();
	const fallbackAvatar = getFallbackString(data?.me.fullname ?? "");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<ProfileForm>({
		resolver: zodResolver(profileSchema),
	});

	useEffect(() => {
		if (data?.me) {
			form.reset({
				fullname: data.me.fullname || "",
				address: data.me.address || "",
				city: data.me.city || "",
				state: data.me.state || "",
				zipCode: data.me.zipCode || "",
				biography: data.me.biography || "",
			});
		}
	}, [data?.me, form]);

	if (!data?.me) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-blue-500" />
			</div>
		);
	}

	const handleSave = form.handleSubmit(async (values) => {
		if (!data?.me) return;

		const changed: UpdateUserInput = {};
		if (values.fullname !== data.me.fullname) changed.fullname = values.fullname;
		if ((values.address || null) !== (data.me.address || null))
			changed.address = values.address === "" ? null : values.address;
		if ((values.city || null) !== (data.me.city || null)) changed.city = values.city === "" ? null : values.city;
		if ((values.state || null) !== (data.me.state || null))
			changed.state = values.state === "" ? null : values.state;
		if ((values.zipCode || null) !== (data.me.zipCode || null))
			changed.zipCode = values.zipCode === "" ? null : values.zipCode;
		if ((values.biography || null) !== (data.me.biography || null))
			changed.biography = values.biography === "" ? null : values.biography;

		if (Object.keys(changed).length === 0) {
			setIsEditing(false);
			return;
		}
		await mutateUpdateUser(changed);
		setIsEditing(false);
	});

	const handleCancel = () => {
		if (data?.me) {
			form.reset({
				fullname: data.me.fullname,
				address: data.me.address || "",
				city: data.me.city || "",
				state: data.me.state || "",
				zipCode: data.me.zipCode || "",
				biography: data.me.biography || "",
			});
		}
		setIsEditing(false);
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
		if (!allowedTypes.includes(file.type)) {
			alert("Only accept PNG, JPEG, JPG, WEBP.");
			return;
		}

		await mutateUpdateUserAvatar(file);
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
							<AvatarFallback className="text-2xl">{fallbackAvatar}</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Profile Picture</h3>
								<Badge variant="secondary">Premium</Badge>
							</div>
							<p className="text-sm text-gray-600">Upload a new profile picture</p>
							{isEditing && (
								<>
									<input
										type="file"
										accept="image/png, image/jpeg, image/jpg, image/webp"
										style={{ display: "none" }}
										ref={fileInputRef}
										onChange={handleFileChange}
									/>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center gap-2 bg-transparent"
										type="button"
										onClick={() => {
											fileInputRef.current?.click();
										}}
									>
										<Upload className="h-4 w-4" />
										Upload New Photo
									</Button>
								</>
							)}
						</div>
					</div>

					{/* Form Fields */}
					<form className="grid gap-6 md:grid-cols-2" onSubmit={handleSave}>
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="fullname">Full name</Label>
							<Input id="fullname" {...form.register("fullname")} disabled={!isEditing} />
							{form.formState.errors.fullname && (
								<p className="text-sm text-red-600">{form.formState.errors.fullname.message}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<Input id="email" type="email" disabled />
						</div>
						<div className="space-y-2">
							<Label htmlFor="phone">Phone Number</Label>
							<Input id="phone" disabled />
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="address">Address</Label>
							<Input id="address" {...form.register("address")} disabled={!isEditing} />
							{form.formState.errors.address && (
								<p className="text-sm text-red-600">{form.formState.errors.address.message}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="city">City</Label>
							<Input id="city" {...form.register("city")} disabled={!isEditing} />
							{form.formState.errors.city && (
								<p className="text-sm text-red-600">{form.formState.errors.city.message}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="state">State</Label>
							<Input id="state" {...form.register("state")} disabled={!isEditing} />
							{form.formState.errors.state && (
								<p className="text-sm text-red-600">{form.formState.errors.state.message}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="zipCode">ZIP Code</Label>
							<Input id="zipCode" {...form.register("zipCode")} disabled={!isEditing} />
							{form.formState.errors.zipCode && (
								<p className="text-sm text-red-600">{form.formState.errors.zipCode.message}</p>
							)}
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="biography">Biography</Label>
							<Textarea id="biography" {...form.register("biography")} disabled={!isEditing} rows={3} />
							{form.formState.errors.biography && (
								<p className="text-sm text-red-600">{form.formState.errors.biography.message}</p>
							)}
						</div>
						{/* Save Button */}
						{isEditing && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex justify-end space-x-2 md:col-span-2"
							>
								<Button variant="outline" type="button" onClick={handleCancel}>
									Cancel
								</Button>
								<Button type="submit" className="flex items-center gap-2">
									<Save className="h-4 w-4" />
									Save Changes
								</Button>
							</motion.div>
						)}
					</form>
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
