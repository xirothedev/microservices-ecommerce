import ClickSpark from "@/components/click-spark";
import { CookieConsent } from "@/components/cookie-consent";
import Footer from "@/components/footer";
import Header from "@/components/header";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Web Store",
	description: "Chuyên cung cấp các dịch vụ số chất lượng cao",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
					<QueryProvider>
						<ClickSpark sparkColor="#f9fafb" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
							<Header />
							{children}
							<Footer />
							<CookieConsent />
							<Toaster />
						</ClickSpark>
					</QueryProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
