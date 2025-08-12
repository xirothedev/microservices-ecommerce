import ProtectedProvider from "@/components/providers/protected-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Profile",
	description: "Manage your account settings, view transaction history, and access support tickets.",
};

export default function ProfileLayout({ children }: { children: React.ReactElement }) {
	return (
		<ProtectedProvider>
			<main className="min-h-screen bg-gray-50">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
			</main>
		</ProtectedProvider>
	);
}
