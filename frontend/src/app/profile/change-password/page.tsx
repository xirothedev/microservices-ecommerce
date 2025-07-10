import { Suspense } from "react"
import type { Metadata } from "next"
import ChangePasswordSkeleton from "@/components/profile/change-password-skeleton"
import ChangePasswordContent from "@/components/profile/change-password-content"

export const metadata: Metadata = {
  title: "Change Password - DigitalPro | Account Security",
  description: "Update your account password to keep your account secure and protected.",
}

export default function ChangePasswordPage() {
  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
          <p className="text-gray-600 mt-2">Update your password to keep your account secure</p>
        </div>

        <Suspense fallback={<ChangePasswordSkeleton />}>
          <ChangePasswordContent />
        </Suspense>
      </div>
    </main>
  )
}
