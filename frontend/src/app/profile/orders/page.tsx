import { Suspense } from "react"
import type { Metadata } from "next"
import OrdersSkeleton from "@/components/profile/orders-skeleton"
import OrdersContent from "@/components/profile/orders-content"

export const metadata: Metadata = {
  title: "Order History - DigitalPro | Track Your Orders",
  description: "View your complete order history and track the status of your digital services.",
}

export default function OrdersPage() {
  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">Track your orders and view detailed information about your purchases</p>
        </div>

        <Suspense fallback={<OrdersSkeleton />}>
          <OrdersContent />
        </Suspense>
      </div>
    </main>
  )
}
