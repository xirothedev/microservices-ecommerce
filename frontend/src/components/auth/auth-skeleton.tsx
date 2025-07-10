"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AuthSkeleton() {
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="text-center pb-6">
        <Skeleton className="h-8 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Steps skeleton */}
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-3 w-12 mt-2" />
              </div>
              {i < 3 && <Skeleton className="flex-1 h-0.5 mx-2" />}
            </div>
          ))}
        </div>

        {/* Form fields skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-10 w-full" />

        {/* Link skeleton */}
        <Skeleton className="h-4 w-48 mx-auto" />
      </CardContent>
    </Card>
  )
}
