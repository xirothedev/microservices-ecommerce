"use client"

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-6">
          <div className="flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}
