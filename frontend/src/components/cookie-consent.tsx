"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type CookieCategory = "necessary" | "functional" | "analytics" | "marketing";

interface CookiePreferences {
	necessary: boolean;
	functional: boolean;
	analytics: boolean;
	marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
	necessary: true, // Always required
	functional: false,
	analytics: false,
	marketing: false,
};

export function CookieConsent() {
	const [showBanner, setShowBanner] = useState(false);
	const [showPreferences, setShowPreferences] = useState(false);
	const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
	const [activeTab, setActiveTab] = useState<string>("privacy");

	// Check if consent has been given before
	useEffect(() => {
		const storedConsent = localStorage.getItem("cookieConsent");
		if (!storedConsent) {
			setShowBanner(true);
		} else {
			try {
				setPreferences(JSON.parse(storedConsent));
			} catch {
				// If parsing fails, reset to default
				setPreferences(defaultPreferences);
			}
		}
	}, []);

	const handleAcceptAll = () => {
		const allAccepted = {
			necessary: true,
			functional: true,
			analytics: true,
			marketing: true,
		};
		setPreferences(allAccepted);
		localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
		setShowBanner(false);
	};

	const handleRejectNonEssential = () => {
		const essentialOnly = {
			necessary: true,
			functional: false,
			analytics: false,
			marketing: false,
		};
		setPreferences(essentialOnly);
		localStorage.setItem("cookieConsent", JSON.stringify(essentialOnly));
		setShowBanner(false);
	};

	const handleSavePreferences = () => {
		localStorage.setItem("cookieConsent", JSON.stringify(preferences));
		setShowPreferences(false);
		setShowBanner(false);
	};

	const handleToggle = (category: CookieCategory) => {
		if (category === "necessary") return; // Cannot toggle necessary cookies
		setPreferences((prev) => ({
			...prev,
			[category]: !prev[category],
		}));
	};

	const openPreferences = () => {
		setShowPreferences(true);
	};

	return (
		<>
			{/* Cookie Banner */}
			<AnimatePresence>
				{showBanner && (
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 100, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="bg-background fixed right-0 bottom-0 left-0 z-50 border-t p-4 shadow-lg md:p-6"
					>
						<div className="container mx-auto">
							<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
								<div className="flex-1">
									<h2 className="mb-2 text-lg font-semibold">We value your privacy</h2>
									<p className="text-muted-foreground text-sm">
										We use cookies to enhance your browsing experience, serve personalized ads or
										content, and analyze our traffic. By clicking &quot;Accept All&quot;, you
										consent to our use of cookies. Read our{" "}
										<button
											onClick={() => {
												setActiveTab("privacy");
												openPreferences();
											}}
											type="button"
											className="text-primary font-medium underline underline-offset-4"
										>
											Privacy Policy
										</button>{" "}
										for more information.
									</p>
								</div>
								<div className="flex flex-col gap-2 sm:flex-row">
									<Button variant="outline" onClick={handleRejectNonEssential}>
										Essential Only
									</Button>
									<Button variant="outline" onClick={openPreferences}>
										Customize
									</Button>
									<Button onClick={handleAcceptAll}>Accept All</Button>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Cookie Preferences Dialog */}
			<Dialog open={showPreferences} onOpenChange={setShowPreferences}>
				<DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Privacy Preferences Center</DialogTitle>
						<DialogDescription>
							Manage your cookie preferences. Essential cookies cannot be disabled as they are required
							for the website to function properly.
						</DialogDescription>
					</DialogHeader>

					<Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
						<TabsList className="grid w-full grid-cols-3">
							{[
								{ value: "privacy", label: "Privacy Policy" },
								{ value: "cookies", label: "Cookie Policy" },
								{ value: "settings", label: "Cookie Settings" },
							].map((tab) => (
								<TabsTrigger key={tab.value} value={tab.value}>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>

						<TabsContent value="privacy" className="mt-4 space-y-4">
							<h3 className="text-lg font-semibold">Privacy Policy</h3>
							<div className="text-muted-foreground space-y-2 text-sm">
								<p>
									At The Terminal Viet Nam, we take your privacy seriously. This Privacy Policy
									explains how we collect, use, disclose, and safeguard your information when you
									visit our website.
								</p>
								<p>
									<strong>More information:</strong>{" "}
									<Link href="/privacy-policy" className="hover:text-black dark:hover:text-white">
										click here
									</Link>
									.
								</p>
							</div>
						</TabsContent>

						<TabsContent value="cookies" className="mt-4 space-y-4">
							<h3 className="text-lg font-semibold">Cookie Policy</h3>
							<div className="text-muted-foreground space-y-2 text-sm">
								<p>
									Our website uses cookies to enhance your browsing experience. Cookies are small text
									files that are stored on your device when you visit our website.
								</p>
								<p>
									<strong>Types of Cookies We Use:</strong>
								</p>
								<ul className="list-disc space-y-1 pl-5">
									{[
										{
											type: "Essential Cookies",
											description:
												"These cookies are necessary for the website to function properly and cannot be disabled.",
										},
										{
											type: "Functional Cookies",
											description:
												"These cookies enable personalized features and remember your preferences.",
										},
										{
											type: "Analytics Cookies",
											description:
												"These cookies help us understand how visitors interact with our website, allowing us to improve our services.",
										},
										{
											type: "Marketing Cookies",
											description:
												"These cookies are used to track visitors across websites to display relevant advertisements.",
										},
									].map((cookie) => (
										<li key={cookie.type}>
											<strong>{cookie.type}:</strong> {cookie.description}
										</li>
									))}
								</ul>
								<p>
									<strong>Managing Cookies:</strong> You can manage your cookie preferences through
									our Cookie Settings tab. You can also control cookies through your browser settings,
									although blocking some types of cookies may impact your experience on our website.
								</p>
								<p>
									<strong>Last Updated:</strong> May 12, 2025
								</p>
							</div>
						</TabsContent>

						<TabsContent value="settings" className="mt-4 space-y-4">
							<h3 className="text-lg font-semibold">Cookie Settings</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Essential Cookies</h4>
										<p className="text-muted-foreground text-sm">
											These cookies are necessary for the website to function properly and cannot
											be disabled.
										</p>
									</div>
									<Switch
										checked={preferences.necessary}
										disabled
										className="data-[state=checked]:bg-primary/50"
									/>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Functional Cookies</h4>
										<p className="text-muted-foreground text-sm">
											These cookies enable personalized features and remember your preferences.
										</p>
									</div>
									<Switch
										checked={preferences.functional}
										onCheckedChange={() => handleToggle("functional")}
										aria-label="Toggle functional cookies"
									/>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Analytics Cookies</h4>
										<p className="text-muted-foreground text-sm">
											These cookies help us understand how visitors interact with our website.
										</p>
									</div>
									<Switch
										checked={preferences.analytics}
										onCheckedChange={() => handleToggle("analytics")}
										aria-label="Toggle analytics cookies"
									/>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Marketing Cookies</h4>
										<p className="text-muted-foreground text-sm">
											These cookies are used to display relevant advertisements.
										</p>
									</div>
									<Switch
										checked={preferences.marketing}
										onCheckedChange={() => handleToggle("marketing")}
										aria-label="Toggle marketing cookies"
									/>
								</div>
							</div>
						</TabsContent>
					</Tabs>

					<DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
						<Button variant="outline" onClick={() => setShowPreferences(false)}>
							Cancel
						</Button>
						<div className="mb-2 flex flex-col gap-2 sm:mb-0 sm:flex-row">
							<Button variant="outline" onClick={handleRejectNonEssential}>
								Essential Only
							</Button>
							<Button onClick={handleSavePreferences}>Save Preferences</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Cookie Settings Button (Fixed at bottom left) */}
			<div
				className={cn(
					"bg-background fixed bottom-4 left-4 z-40 cursor-pointer rounded-full border p-2 shadow-md transition-opacity duration-300",
					showBanner ? "pointer-events-none opacity-0" : "opacity-100",
				)}
				onClick={openPreferences}
				aria-label="Cookie Settings"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-muted-foreground"
				>
					<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
					<path d="M8.5 8.5v.01" />
					<path d="M16 15.5v.01" />
					<path d="M12 12v.01" />
				</svg>
			</div>
		</>
	);
}
