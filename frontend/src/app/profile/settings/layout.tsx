import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Settings - DigitalPro | Manage Your Account",
	description: "Manage your account settings, preferences, and security.",
};

export default function SettingsLayout({ children }: { children: React.ReactElement }) {
	return <>{children}</>;
}
