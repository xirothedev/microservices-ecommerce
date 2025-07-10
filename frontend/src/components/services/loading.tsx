import ServicesLoading from "./services-loading"

export default function Loading() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero skeleton */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="h-8 bg-white/20 rounded w-48 mx-auto animate-pulse" />
            <div className="space-y-4">
              <div className="h-16 bg-white/20 rounded w-3/4 mx-auto animate-pulse" />
              <div className="h-6 bg-white/20 rounded w-1/2 mx-auto animate-pulse" />
            </div>
            <div className="flex gap-4 justify-center">
              <div className="h-12 bg-white/20 rounded w-32 animate-pulse" />
              <div className="h-12 bg-white/20 rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Services skeleton */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 bg-white rounded-lg animate-pulse mb-8" />
          <ServicesLoading />
        </div>
      </section>
    </main>
  )
}
