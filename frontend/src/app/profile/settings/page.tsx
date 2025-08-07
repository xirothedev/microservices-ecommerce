"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, AlertTriangle } from "lucide-react";
import { useUpdateUserSettings, useUserSettings } from "@/lib/api/user";
import { UserSettings } from "@/@types/api/user";
import { toast } from "@/hooks/use-toast";

export default function AccountSettings() {
	const [settings, setSettings] = useState<UserSettings>();
	const { data, isLoading } = useUserSettings();
	const { mutate: updateSettings, isPending } = useUpdateUserSettings();

	const isDisabled = isLoading || isPending;

	// Check if at least one primary notification type is enabled
	const hasBasicNotificationEnabled = settings?.emailNotifications || settings?.browserNotifications;

	// Handle setting updates with validation
	const handleSettingUpdate = (key: keyof UserSettings, checked: boolean) => {
		if (!settings) return;

		// If trying to enable other notification types without basic ones enabled
		if (key !== "emailNotifications" && key !== "browserNotifications" && checked && !hasBasicNotificationEnabled) {
			toast({
				title: "Enable basic notifications first",
				description: "Please enable Email or Browser notifications before enabling other notification types.",
				variant: "destructive",
			});
			return;
		}

		// Proceed with the update
		updateSettings(
			{ setting: key, type: checked },
			{
				onSuccess(data) {
					setSettings(data);

					// If disabling a primary notification and no primary notifications will be left,
					// automatically disable all other notification types
					if ((key === "emailNotifications" || key === "browserNotifications") && !checked) {
						const otherPrimaryType =
							key === "emailNotifications" ? "browserNotifications" : "emailNotifications";
					}
				},
			},
		);
	};

	useEffect(() => {
		if (data) {
			setSettings(data);
		}
	}, [data]);

	return (
		<div className="space-y-6">
			{/* Notification Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bell className="h-5 w-5" />
						Notification Preferences
					</CardTitle>
					<CardDescription>Choose how you want to receive notifications and updates</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Warning message when no basic notifications are enabled */}
					{!hasBasicNotificationEnabled && (
						<Alert className="border-amber-200 bg-amber-50">
							<AlertTriangle className="h-4 w-4 text-amber-600" />
							<AlertDescription className="text-amber-800">
								<strong>Notice:</strong> Other notification types are disabled because both Email and
								Browser notifications are turned off. Enable at least one to use other notification
								types.
							</AlertDescription>
						</Alert>
					)}

					<div className="space-y-4">
						{[
							{
								key: "emailNotifications",
								label: "Email Notifications",
								description: "Receive notifications via email",
							},
							{
								key: "browserNotifications",
								label: "Browser Notifications",
								description: "Receive push notifications in your browser",
							},
							{
								key: "ticketNotifications",
								label: "Ticket Notifications",
								description: "Get notified about support ticket updates",
							},
							{
								key: "suggestedProducts",
								label: "Suggested Products",
								description: "Receive personalized product recommendations",
							},
							{
								key: "promotionNotifications",
								label: "Promotion Notifications",
								description: "Receive promotional offers and discounts",
							},
							{
								key: "priceChangesNotifications",
								label: "Price Change Notifications",
								description: "Get notified when product prices change",
							},
							{
								key: "loginNotifications",
								label: "Login Notifications",
								description: "Get notified of new login attempts",
							},
							{
								key: "restockNotifications",
								label: "Restock Notifications",
								description: "Get notified when out-of-stock items are available",
							},
						].map(({ key, label, description }) => {
							const settingKey = key as keyof UserSettings;
							const isPrimaryNotification =
								settingKey === "emailNotifications" || settingKey === "browserNotifications";
							const isOtherNotificationDisabled = !isPrimaryNotification && !hasBasicNotificationEnabled;

							return (
								<div className="flex items-center justify-between" key={key}>
									<div className="space-y-0.5">
										<Label
											className={`text-base ${isOtherNotificationDisabled ? "text-gray-400" : ""}`}
										>
											{label}
										</Label>
										<p
											className={`text-sm ${isOtherNotificationDisabled ? "text-gray-400" : "text-gray-600"}`}
										>
											{description}
											{isOtherNotificationDisabled && (
												<span className="mt-1 block text-xs text-amber-600">
													Enable Email or Browser notifications first
												</span>
											)}
										</p>
									</div>
									<Switch
										checked={settings?.[settingKey] || false}
										onCheckedChange={(checked) => handleSettingUpdate(settingKey, checked)}
										disabled={isDisabled || isOtherNotificationDisabled}
									/>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
