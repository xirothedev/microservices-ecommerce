import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Change Password",
	description: "Update your account password to keep your account secure and protected.",
};

export default function ChangePasswordLayout({ children }: { children: React.ReactElement }) {
	return <>{children}</>;
}
