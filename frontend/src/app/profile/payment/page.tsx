import { Suspense } from "react"
import type { Metadata } from "next"
import PaymentSkeleton from "@/components/profile/payment-skeleton"
import PaymentContent from "@/components/profile/payment-content"

export const metadata: Metadata = {
  title: "Payment History - DigitalPro | Manage Your Payments",
  description: "View and manage your payment transactions, methods, and billing history.",
}

export default function PaymentPage() {
  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-2">View your transaction history and manage payment methods</p>
        </div>

        <Suspense fallback={<PaymentSkeleton />}>
          <PaymentContent />
        </Suspense>
      </div>
    </main>
  )
}
