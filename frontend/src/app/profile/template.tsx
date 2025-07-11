"use client";

import ProfileSidebar from "@/components/profile/profile-sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function ProfileTemplate({ children }: { children: React.ReactElement }) {
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

	return (
		<div className="grid gap-8 lg:grid-cols-4">
			{/* Mobile Menu Button */}
			<div className="mb-4 lg:hidden">
				<Button variant="outline" onClick={() => setSidebarOpen(true)} className="w-full justify-start">
					<Menu className="mr-2 h-5 w-5" />
					Profile Menu
				</Button>
			</div>

			{/* Desktop Sidebar */}
			<div className="hidden lg:col-span-1 lg:block">
				<ProfileSidebar setSidebarOpen={setSidebarOpen} />
			</div>

			{/* Mobile Sidebar Overlay */}
			<AnimatePresence>
				{sidebarOpen && (
					<div className="fixed inset-0 z-50 lg:hidden">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 bg-black/50"
							onClick={() => setSidebarOpen(false)}
						/>
						<motion.div
							initial={{ x: -300 }}
							animate={{ x: 0 }}
							exit={{ x: -300 }}
							className="absolute top-0 left-0 h-full w-80 bg-white shadow-xl"
						>
							<div className="flex items-center justify-between border-b p-4">
								<h3 className="text-lg font-semibold">Profile Menu</h3>
								<Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
									<X className="h-5 w-5" />
								</Button>
							</div>
							<div className="p-4">
								<ProfileSidebar setSidebarOpen={setSidebarOpen} />
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* Main Content */}
			<div className="lg:col-span-3">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					{children}
				</motion.div>
			</div>
		</div>
	);
}
