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
									<h2 className="mb-2 text-lg font-semibold">
										Chúng tôi coi trọng quyền riêng tư của bạn
									</h2>
									<p className="text-muted-foreground text-sm">
										Chúng tôi sử dụng cookie để cải thiện trải nghiệm duyệt web, cung cấp quảng cáo
										hoặc nội dung cá nhân hóa, và phân tích lưu lượng truy cập. Bằng cách nhấp vào
										&quot;Chấp nhận tất cả&quot;, bạn đồng ý với việc sử dụng cookie của chúng tôi.
										Đọc{" "}
										<button
											onClick={() => {
												setActiveTab("privacy");
												openPreferences();
											}}
											type="button"
											className="text-primary font-medium underline underline-offset-4"
										>
											Chính sách bảo mật
										</button>{" "}
										để biết thêm thông tin.
									</p>
								</div>
								<div className="flex flex-col gap-2 sm:flex-row">
									<Button variant="outline" onClick={handleRejectNonEssential}>
										Chỉ cần thiết
									</Button>
									<Button variant="outline" onClick={openPreferences}>
										Tùy chỉnh
									</Button>
									<Button onClick={handleAcceptAll}>Chấp nhận tất cả</Button>
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
						<DialogTitle>Trung tâm tùy chọn quyền riêng tư</DialogTitle>
						<DialogDescription>
							Quản lý tùy chọn cookie của bạn. Cookie cần thiết không thể bị vô hiệu hóa vì chúng cần
							thiết để website hoạt động bình thường.
						</DialogDescription>
					</DialogHeader>

					<Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
						<TabsList className="grid w-full grid-cols-3">
							{[
								{ value: "privacy", label: "Chính sách bảo mật" },
								{ value: "cookies", label: "Chính sách cookie" },
								{ value: "settings", label: "Cài đặt cookie" },
							].map((tab) => (
								<TabsTrigger key={tab.value} value={tab.value}>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>

						<TabsContent value="privacy" className="mt-4 space-y-4">
							<h3 className="text-lg font-semibold">Chính sách bảo mật</h3>
							<div className="text-muted-foreground space-y-2 text-sm">
								<p>
									Tại The Terminal Viet Nam, chúng tôi coi trọng quyền riêng tư của bạn. Chính sách
									bảo mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin
									của bạn khi bạn truy cập website của chúng tôi.
								</p>
								<p>
									<strong>Thông tin chi tiết:</strong>{" "}
									<Link href="/privacy-policy" className="hover:text-black dark:hover:text-white">
										nhấp vào đây
									</Link>
									.
								</p>
							</div>
						</TabsContent>

						<TabsContent value="cookies" className="mt-4 space-y-4">
							<h3 className="text-lg font-semibold">Chính sách cookie</h3>
							<div className="text-muted-foreground space-y-2 text-sm">
								<p>
									Website của chúng tôi sử dụng cookie để cải thiện trải nghiệm duyệt web. Cookie là
									các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập website của
									chúng tôi.
								</p>
								<p>
									<strong>Các loại cookie chúng tôi sử dụng:</strong>
								</p>
								<ul className="list-disc space-y-1 pl-5">
									{[
										{
											type: "Cookie cần thiết",
											description:
												"Những cookie này cần thiết để website hoạt động bình thường và không thể bị vô hiệu hóa.",
										},
										{
											type: "Cookie chức năng",
											description:
												"Những cookie này cho phép các tính năng cá nhân hóa và ghi nhớ tùy chọn của bạn.",
										},
										{
											type: "Cookie phân tích",
											description:
												"Những cookie này giúp chúng tôi hiểu cách khách truy cập tương tác với website, cho phép chúng tôi cải thiện dịch vụ.",
										},
										{
											type: "Cookie tiếp thị",
											description:
												"Những cookie này được sử dụng để theo dõi khách truy cập trên các website để hiển thị quảng cáo liên quan.",
										},
									].map((cookie) => (
										<li key={cookie.type}>
											<strong>{cookie.type}:</strong> {cookie.description}
										</li>
									))}
								</ul>
								<p>
									<strong>Quản lý cookie:</strong> Bạn có thể quản lý tùy chọn cookie thông qua tab
									Cài đặt cookie. Bạn cũng có thể kiểm soát cookie thông qua cài đặt trình duyệt, mặc
									dù chặn một số loại cookie có thể ảnh hưởng đến trải nghiệm của bạn trên website.
								</p>
								<p>
									<strong>Cập nhật lần cuối:</strong> 12 tháng 5, 2025
								</p>
							</div>
						</TabsContent>

						<TabsContent value="settings" className="mt-4 space-y-4">
							<h3 className="text-lg font-semibold">Cài đặt cookie</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Cookie cần thiết</h4>
										<p className="text-muted-foreground text-sm">
											Những cookie này cần thiết để website hoạt động bình thường và không thể bị
											vô hiệu hóa.
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
										<h4 className="font-medium">Cookie chức năng</h4>
										<p className="text-muted-foreground text-sm">
											Những cookie này cho phép các tính năng cá nhân hóa và ghi nhớ tùy chọn của
											bạn.
										</p>
									</div>
									<Switch
										checked={preferences.functional}
										onCheckedChange={() => handleToggle("functional")}
										aria-label="Bật/tắt cookie chức năng"
									/>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Cookie phân tích</h4>
										<p className="text-muted-foreground text-sm">
											Những cookie này giúp chúng tôi hiểu cách khách truy cập tương tác với
											website.
										</p>
									</div>
									<Switch
										checked={preferences.analytics}
										onCheckedChange={() => handleToggle("analytics")}
										aria-label="Bật/tắt cookie phân tích"
									/>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Cookie tiếp thị</h4>
										<p className="text-muted-foreground text-sm">
											Những cookie này được sử dụng để hiển thị quảng cáo liên quan.
										</p>
									</div>
									<Switch
										checked={preferences.marketing}
										onCheckedChange={() => handleToggle("marketing")}
										aria-label="Bật/tắt cookie tiếp thị"
									/>
								</div>
							</div>
						</TabsContent>
					</Tabs>

					<DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
						<Button variant="outline" onClick={() => setShowPreferences(false)}>
							Hủy
						</Button>
						<div className="mb-2 flex flex-col gap-2 sm:mb-0 sm:flex-row">
							<Button variant="outline" onClick={handleRejectNonEssential}>
								Chỉ cần thiết
							</Button>
							<Button onClick={handleSavePreferences}>Lưu tùy chọn</Button>
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
				aria-label="Cài đặt cookie"
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
