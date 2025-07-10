import { Suspense } from "react"
import type { Metadata } from "next"
import TicketsHeader from "@/components/ticket/tickets-header"
import TicketsSkeleton from "@/components/ticket/tickets-skeleton"
import TicketsMain from "@/components/ticket/tickets-main"

export const metadata: Metadata = {
  title: "Support Tickets - DigitalPro | Submit & Track Support Requests",
  description:
    "Submit new support tickets and track your ticket history. Chat with our support team in real-time for faster resolution.",
  keywords: "support tickets, customer support, help desk, technical support, submit ticket, chat support",
}

export default function TicketsPage() {
  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TicketsHeader />

        <Suspense fallback={<TicketsSkeleton />}>
          <TicketsMain />
        </Suspense>
      </div>
    </main>
  )
}
