export default function OrdersSkeleton() {
	return (
		<div className="space-y-6">
			{/* Summary Cards Skeleton */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="rounded-lg bg-white p-6 shadow-sm">
						<div className="flex items-center justify-between">
							<div className="space-y-2">
								<div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
								<div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
							</div>
							<div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
						</div>
					</div>
				))}
			</div>

			{/* Filters Skeleton */}
			<div className="rounded-lg bg-white p-6 shadow-sm">
				<div className="space-y-4">
					<div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
					<div className="flex flex-col gap-4 md:flex-row">
						<div className="h-10 flex-1 animate-pulse rounded bg-gray-200" />
						<div className="flex gap-2">
							<div className="h-10 w-40 animate-pulse rounded bg-gray-200" />
							<div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
						</div>
					</div>
				</div>
			</div>

			{/* Orders Skeleton */}
			<div className="space-y-4">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="rounded-lg bg-white p-6 shadow-sm">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="space-y-2">
									<div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
									<div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
								</div>
								<div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
							</div>
							<div className="flex items-center gap-4">
								<div className="space-y-2 text-right">
									<div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
									<div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
								</div>
								<div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
