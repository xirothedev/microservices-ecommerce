import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Tickets - DigitalPro | Submit & Track Support Requests",
	description:
		"Submit new support tickets and track your ticket history. Chat with our support team in real-time for faster resolution.",
	keywords: "support tickets, customer support, help desk, technical support, submit ticket, chat support",
};

export default function ProfileLayout({ children }: { children: React.ReactElement }) {
	return <>{children}</>;
}
