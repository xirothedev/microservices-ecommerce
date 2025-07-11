import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Order History",
	description: "View your complete order history and track the status of your digital services.",
};

export default function OrdersLayout({ children }: { children: React.ReactElement }) {
	return <>{children}</>;
}
