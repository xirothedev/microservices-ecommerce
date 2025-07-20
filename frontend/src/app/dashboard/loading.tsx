"use client";

export default function DashboardSkeleton() {
	return (
		<div className="min-h-screen bg-gray-50 pt-20">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header Skeleton */}
				<div className="mb-8">
					<div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200" />
					<div className="h-4 w-96 animate-pulse rounded bg-gray-200" />
				</div>

				{/* Tabs Skeleton */}
				<div className="mb-6">
					<div className="flex space-x-4">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="h-10 w-24 animate-pulse rounded bg-gray-200" />
						))}
					</div>
				</div>

				{/* Stats Cards Skeleton */}
				<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200" />
					))}
				</div>

				{/* Content Skeleton */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="h-96 animate-pulse rounded-lg bg-gray-200" />
					<div className="h-96 animate-pulse rounded-lg bg-gray-200" />
				</div>
			</div>
		</div>
	);
}
