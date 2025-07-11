import { Metadata } from "next";

export const metadata: Metadata = {
	title: "",
	description: "",
};

export default function CartLayout({ children }: { children: React.ReactElement }) {
	return (
		<div className="min-h-screen bg-gray-50 pt-20">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
		</div>
	);
}
