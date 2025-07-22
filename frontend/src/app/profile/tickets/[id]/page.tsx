import TicketDetail from "@/app/profile/components/ticket/ticket-detail";
import { useQuery } from "@tanstack/react-query";
import type { Metadata } from "next";

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

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
	const { id } = await params;

	return <TicketDetail ticketId={id} />;
}
