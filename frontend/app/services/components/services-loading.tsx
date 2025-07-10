export default function ServicesLoading() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image skeleton */}
            <div className="aspect-[4/3] bg-gray-200 animate-pulse" />

            {/* Content skeleton */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>

              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-14 animate-pulse" />
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-12 animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
