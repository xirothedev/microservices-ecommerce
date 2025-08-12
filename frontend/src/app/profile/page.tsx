"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useUpdateUserAvatarMutation, useUpdateUserMutation, useUserQuery } from "@/lib/api/user";
import { getFallbackString } from "@/lib/utils";
import { ProfileForm, profileSchema } from "@/zods/user";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Edit, Loader2, Save, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ImageCropModal from "./components/image-crop-modal";
import { UpdateUserInput } from "@/@types/api/user";

export default function PersonalInformation() {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
	const [tempImageSrc, setTempImageSrc] = useState<string>("");
	const { data } = useUserQuery();
	const { mutateAsync: mutateUpdateUserAvatar } = useUpdateUserAvatarMutation();
	const [mutateUpdateUser] = useUpdateUserMutation();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const fallbackAvatar = getFallbackString(data?.me.fullname ?? "");

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

		// Check if file is an image
		const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
		if (!allowedTypes.includes(file.type)) {
			alert("Chỉ chấp nhận PNG, JPEG, JPG, WEBP.");
			return;
		}

		// Check file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast({
				title: "Tệp quá lớn",
				description: "Vui lòng chọn hình ảnh nhỏ hơn 5MB",
				variant: "destructive",
			});
			return;
		}

		const tempUrl = URL.createObjectURL(file);
		setTempImageSrc(tempUrl);
		setIsCropModalOpen(true);
		// await mutateUpdateUserAvatar(file);
	};

	const handleCropComplete = async (_croppedImageUrl: string, croppedFile: File) => {
		// Clean up the temporary URL
		if (tempImageSrc) {
			URL.revokeObjectURL(tempImageSrc);
		}

		// Update avatar
		await mutateUpdateUserAvatar(croppedFile);
	};

	return (
		<>
			<div className="space-y-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>Thông tin cá nhân</CardTitle>
							<CardDescription>Quản lý thông tin cá nhân và thông tin liên hệ của bạn</CardDescription>
						</div>
						<Button
							variant={isEditing ? "outline" : "default"}
							onClick={() => setIsEditing(!isEditing)}
							className="flex items-center gap-2"
						>
							{isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
							{isEditing ? "Hủy" : "Chỉnh sửa"}
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
									alt="Hồ sơ"
								/>
								<AvatarFallback className="text-2xl">{fallbackAvatar}</AvatarFallback>
							</Avatar>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-semibold">Ảnh đại diện</h3>
									<Badge variant="secondary">Premium</Badge>
								</div>
								<p className="text-sm text-gray-600">Tải lên ảnh đại diện mới</p>
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
											Tải lên ảnh mới
										</Button>
									</>
								)}
							</div>
						</div>

						{/* Form Fields */}
						<form className="grid gap-6 md:grid-cols-2" onSubmit={handleSave}>
							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="fullname">Họ và tên</Label>
								<Input id="fullname" {...form.register("fullname")} disabled={!isEditing} />
								{form.formState.errors.fullname && (
									<p className="text-sm text-red-600">{form.formState.errors.fullname.message}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Địa chỉ email</Label>
								<Input id="email" value={data.me.email} type="email" disabled />
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Số điện thoại</Label>
								<Input id="phone" value={data.me.phone ?? undefined} disabled />
							</div>
							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="address">Địa chỉ</Label>
								<Input id="address" {...form.register("address")} disabled={!isEditing} />
								{form.formState.errors.address && (
									<p className="text-sm text-red-600">{form.formState.errors.address.message}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="city">Thành phố</Label>
								<Input id="city" {...form.register("city")} disabled={!isEditing} />
								{form.formState.errors.city && (
									<p className="text-sm text-red-600">{form.formState.errors.city.message}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="state">Tỉnh/Bang</Label>
								<Input id="state" {...form.register("state")} disabled={!isEditing} />
								{form.formState.errors.state && (
									<p className="text-sm text-red-600">{form.formState.errors.state.message}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="zipCode">Mã bưu điện</Label>
								<Input id="zipCode" {...form.register("zipCode")} disabled={!isEditing} />
								{form.formState.errors.zipCode && (
									<p className="text-sm text-red-600">{form.formState.errors.zipCode.message}</p>
								)}
							</div>
							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="biography">Tiểu sử</Label>
								<Textarea
									id="biography"
									{...form.register("biography")}
									disabled={!isEditing}
									rows={3}
								/>
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
										Hủy
									</Button>
									<Button type="submit" className="flex items-center gap-2">
										<Save className="h-4 w-4" />
										Lưu thay đổi
									</Button>
								</motion.div>
							)}
						</form>
					</CardContent>
				</Card>

				{/* Account Status Card */}
				<Card>
					<CardHeader>
						<CardTitle>Trạng thái tài khoản</CardTitle>
						<CardDescription>Thông tin tài khoản và chi tiết thành viên của bạn</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-3">
							<div className="rounded-lg bg-blue-50 p-4 text-center">
								<div className="text-2xl font-bold text-blue-600">Premium</div>
								<div className="text-sm text-gray-600">Loại tài khoản</div>
							</div>
							<div className="rounded-lg bg-green-50 p-4 text-center">
								<div className="text-2xl font-bold text-green-600">Hoạt động</div>
								<div className="text-sm text-gray-600">Trạng thái</div>
							</div>
							<div className="rounded-lg bg-purple-50 p-4 text-center">
								<div className="text-2xl font-bold text-purple-600">
									{data?.me.createdAt ? dayjs(data.me.createdAt).format("MMM YYYY") : ""}
								</div>
								<div className="text-sm text-gray-600">Thành viên từ</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Image Crop Modal */}
			<ImageCropModal
				isOpen={isCropModalOpen}
				onClose={() => {
					setIsCropModalOpen(false);
					if (tempImageSrc) {
						URL.revokeObjectURL(tempImageSrc);
					}
				}}
				imageSrc={tempImageSrc}
				onCropComplete={handleCropComplete}
				aspectRatio={1} // 1:1 aspect ratio for profile pictures
				cropShape="round" // Round crop for avatar
				fileName="profile-picture"
			/>
		</>
	);
}
