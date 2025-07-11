import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		absolute: "DigitalPro - Premium Digital Services",
		template: "DigitalPro - %s",
		default: "DigitalPro",
	},
	description:
		"Professional digital services including Apple ID setup, social media management, and premium subscriptions. Trusted by thousands of customers worldwide.",
	keywords: "digital services, Apple ID, Facebook management, YouTube Premium, digital solutions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="scroll-smooth bg-gray-50" suppressHydrationWarning>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
