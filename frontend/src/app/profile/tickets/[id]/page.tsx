import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TicketDetailSkeleton from "@/app/profile/tickets/[id]/loading";
import TicketDetail from "@/components/ticket/ticket-detail";

interface TicketDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata({ params }: TicketDetailPageProps): Promise<Metadata> {
	const { id } = await params;

	return {
		title: `Ticket #${id} - DigitalPro Support`,
		description: `View and chat about support ticket #${id}`,
	};
}

// Mock function to validate ticket ID
function isValidTicketId(id: string): boolean {
	return /^TKT-\d{6}$/.test(id);
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
	const { id } = await params;

	if (!isValidTicketId(id)) {
		notFound();
	}

	return <TicketDetail ticketId={id} />;
}
