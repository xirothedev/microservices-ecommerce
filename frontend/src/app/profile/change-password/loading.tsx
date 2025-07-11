export default function ChangePasswordSkeleton() {
  return (
    <div className="space-y-6">
      {/* Main Form Skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Password Requirements */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
            <div className="h-2 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Security Cards Skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-40 animate-pulse" />
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
