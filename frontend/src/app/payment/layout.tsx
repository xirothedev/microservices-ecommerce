import { Metadata } from "next";

export const metadata: Metadata = {
	title: "",
	description: "",
};

export default function PaymentLayout({ children }: { children: React.ReactElement }) {
	return <>{children}</>;
}
