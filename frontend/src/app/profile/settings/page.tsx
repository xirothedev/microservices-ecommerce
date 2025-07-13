"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Globe, Download, Trash2, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

export default function AccountSettings() {
	const { setTheme, theme } = useTheme();
	const [settings, setSettings] = useState({
		notifications: {
			email: true,
			push: true,
			sms: false,
			marketing: true,
		},
		privacy: {
			profileVisibility: "public",
			dataSharing: false,
			analytics: true,
		},
		preferences: {
			language: "en",
			timezone: "America/New_York",
			currency: "USD",
		},
		security: {
			twoFactor: true,
			loginAlerts: true,
			sessionTimeout: "30",
		},
	});

	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const updateSetting = (category: string, key: string, value: unknown) => {
		setSettings((prev) => ({
			...prev,
			[category]: {
				...prev[category as keyof typeof prev],
				[key]: value,
			},
		}));
	};

	const handleExportData = () => {
		// Simulate data export
		console.log("Exporting user data...");
	};

	const handleDeleteAccount = () => {
		// This would typically show a more comprehensive confirmation flow
		console.log("Account deletion requested...");
	};

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
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label className="text-base">Email Notifications</Label>
								<p className="text-sm text-gray-600">Receive notifications via email</p>
							</div>
							<Switch
								checked={settings.notifications.email}
								onCheckedChange={(checked) => updateSetting("notifications", "email", checked)}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label className="text-base">Push Notifications</Label>
								<p className="text-sm text-gray-600">Receive push notifications in your browser</p>
							</div>
							<Switch
								checked={settings.notifications.push}
								onCheckedChange={(checked) => updateSetting("notifications", "push", checked)}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label className="text-base">SMS Notifications</Label>
								<p className="text-sm text-gray-600">Receive important updates via SMS</p>
							</div>
							<Switch
								checked={settings.notifications.sms}
								onCheckedChange={(checked) => updateSetting("notifications", "sms", checked)}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label className="text-base">Marketing Communications</Label>
								<p className="text-sm text-gray-600">Receive promotional emails and offers</p>
							</div>
							<Switch
								checked={settings.notifications.marketing}
								onCheckedChange={(checked) => updateSetting("notifications", "marketing", checked)}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Privacy Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Privacy & Security
					</CardTitle>
					<CardDescription>Manage your privacy preferences and security settings</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label className="text-base">Profile Visibility</Label>
								<p className="text-sm text-gray-600">Control who can see your profile</p>
							</div>
							<Select
								value={settings.privacy.profileVisibility}
								onValueChange={(value) => updateSetting("privacy", "profileVisibility", value)}
							>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="public">Public</SelectItem>
									<SelectItem value="private">Private</SelectItem>
									<SelectItem value="friends">Friends Only</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label className="text-base">Data Sharing</Label>
								<p className="text-sm text-gray-600">
									Allow sharing anonymized data for service improvement
								</p>
							</div>
							<Switch
								checked={settings.privacy.dataSharing}
								onCheckedChange={(checked) => updateSetting("privacy", "dataSharing", checked)}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label className="text-base">Analytics Tracking</Label>
								<p className="text-sm text-gray-600">Help us improve by tracking usage analytics</p>
							</div>
							<Switch
								checked={settings.privacy.analytics}
								onCheckedChange={(checked) => updateSetting("privacy", "analytics", checked)}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Preferences */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Globe className="h-5 w-5" />
						Preferences
					</CardTitle>
					<CardDescription>
						Customize your experience with language, timezone, and display preferences
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-2">
							<Label>Language</Label>
							<Select
								value={settings.preferences.language}
								onValueChange={(value) => updateSetting("preferences", "language", value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="en">English</SelectItem>
									<SelectItem value="es">Español</SelectItem>
									<SelectItem value="fr">Français</SelectItem>
									<SelectItem value="de">Deutsch</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Timezone</Label>
							<Select
								value={settings.preferences.timezone}
								onValueChange={(value) => updateSetting("preferences", "timezone", value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="America/New_York">Eastern Time</SelectItem>
									<SelectItem value="America/Chicago">Central Time</SelectItem>
									<SelectItem value="America/Denver">Mountain Time</SelectItem>
									<SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
									<SelectItem value="Europe/London">GMT</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Theme</Label>
							<Select
								value={theme}
								onValueChange={(value) => {
									console.log(value);
									setTheme(value);
									updateSetting("preferences", "theme", value);
								}}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="light">Light</SelectItem>
									<SelectItem value="dark">Dark</SelectItem>
									<SelectItem value="system">System</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Currency</Label>
							<Select
								value={settings.preferences.currency}
								onValueChange={(value) => updateSetting("preferences", "currency", value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="USD">USD ($)</SelectItem>
									<SelectItem value="EUR">EUR (€)</SelectItem>
									<SelectItem value="GBP">GBP (£)</SelectItem>
									<SelectItem value="CAD">CAD (C$)</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Security Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Advanced Security
					</CardTitle>
					<CardDescription>Additional security measures to protect your account</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label className="text-base">Two-Factor Authentication</Label>
								<p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
							</div>
							<Switch
								checked={settings.security.twoFactor}
								onCheckedChange={(checked) => updateSetting("security", "twoFactor", checked)}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label className="text-base">Login Alerts</Label>
								<p className="text-sm text-gray-600">Get notified of new login attempts</p>
							</div>
							<Switch
								checked={settings.security.loginAlerts}
								onCheckedChange={(checked) => updateSetting("security", "loginAlerts", checked)}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label className="text-base">Session Timeout</Label>
								<p className="text-sm text-gray-600">Automatically log out after inactivity</p>
							</div>
							<Select
								value={settings.security.sessionTimeout}
								onValueChange={(value) => updateSetting("security", "sessionTimeout", value)}
							>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="15">15 minutes</SelectItem>
									<SelectItem value="30">30 minutes</SelectItem>
									<SelectItem value="60">1 hour</SelectItem>
									<SelectItem value="never">Never</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Data Management */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Download className="h-5 w-5" />
						Data Management
					</CardTitle>
					<CardDescription>Export your data or manage your account</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<Label className="text-base">Export Account Data</Label>
								<p className="text-sm text-gray-600">Download a copy of your account data</p>
							</div>
							<Button variant="outline" onClick={handleExportData}>
								<Download className="mr-2 h-4 w-4" />
								Export
							</Button>
						</div>
					</div>

					<Separator />

					{/* Danger Zone */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-red-600">
							<AlertTriangle className="h-5 w-5" />
							<h3 className="text-lg font-semibold">Danger Zone</h3>
						</div>

						{!showDeleteConfirm ? (
							<div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
								<div className="space-y-0.5">
									<Label className="text-base text-red-900">Delete Account</Label>
									<p className="text-sm text-red-700">Permanently delete your account and all data</p>
								</div>
								<Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete Account
								</Button>
							</div>
						) : (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								className="space-y-4"
							>
								<Alert className="border-red-200 bg-red-50">
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription className="text-red-700">
										<strong>Warning:</strong> This action cannot be undone. All your data, including
										transactions, purchase history, and support tickets will be permanently deleted.
									</AlertDescription>
								</Alert>
								<div className="flex gap-2">
									<Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
										Cancel
									</Button>
									<Button variant="destructive" onClick={handleDeleteAccount}>
										Yes, Delete My Account
									</Button>
								</div>
							</motion.div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
