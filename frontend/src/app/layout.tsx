import ClickSpark from "@/components/click-spark";
import { CookieConsent } from "@/components/cookie-consent";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { unstable_ViewTransition as ViewTransition } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		absolute: "Digital Pro - Premium Digital Services",
		template: "Digital Pro - %s",
		default: "Digital Pro",
	},
	description:
		"Professional digital services including Apple ID setup, social media management, and premium subscriptions. Trusted by thousands of customers worldwide.",
	keywords: "digital services, Apple ID, Facebook management, YouTube Premium, digital solutions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="scroll-smooth bg-gray-50" suppressHydrationWarning>
			<body className={inter.className}>
				<QueryProvider>
					<ViewTransition>
						<ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
							{children}
							<CookieConsent />
							<Toaster />
						</ClickSpark>
					</ViewTransition>
				</QueryProvider>
			</body>
		</html>
	);
}
