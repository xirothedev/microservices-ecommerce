export default function ProfileLayoutSkeleton() {
  return (
    <div className="grid lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="h-20 w-20 bg-gray-200 rounded-full animate-pulse mx-auto" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
          <div className="space-y-2 pt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
