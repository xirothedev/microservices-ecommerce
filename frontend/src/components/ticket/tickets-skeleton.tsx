export default function TicketsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Form Skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Basic Info Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Priority Selection */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="border rounded-lg">
              <div className="h-12 bg-gray-100 border-b animate-pulse" />
              <div className="h-32 bg-gray-50 animate-pulse" />
            </div>
          </div>

          {/* Context Selector */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
            <div className="h-32 bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
