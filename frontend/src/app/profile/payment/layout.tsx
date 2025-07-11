import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Payment History",
	description: "View and manage your payment transactions, methods, and billing history.",
};

export default function PaymentLayout({ children }: { children: React.ReactElement }) {
	return <>{children}</>;
}
