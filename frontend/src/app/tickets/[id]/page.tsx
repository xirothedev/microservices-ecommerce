import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import TicketDetailSkeleton from "@/components/ticket/ticket-detail-skeleton"
import TicketDetail from "@/components/ticket/ticket-detail"

interface TicketDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: TicketDetailPageProps): Promise<Metadata> {
  return {
    title: `Ticket #${params.id} - DigitalPro Support`,
    description: `View and chat about support ticket #${params.id}`,
  }
}

// Mock function to validate ticket ID
function isValidTicketId(id: string): boolean {
  return /^TKT-\d{6}$/.test(id)
}

export default function TicketDetailPage({ params }: TicketDetailPageProps) {
  if (!isValidTicketId(params.id)) {
    notFound()
  }

  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<TicketDetailSkeleton />}>
          <TicketDetail ticketId={params.id} />
        </Suspense>
      </div>
    </main>
  )
}
