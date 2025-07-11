import { Metadata } from "next";

export const metadata: Metadata = {
	title: "CMS",
	description: "Manage your product listings and content.",
};

export default function CMSLayout({ children }: { children: React.ReactElement }) {
	return <div className="min-h-screen bg-gray-50">{children}</div>;
}
