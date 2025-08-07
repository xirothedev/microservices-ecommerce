import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Error",
};

export default function ErrorLayout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
