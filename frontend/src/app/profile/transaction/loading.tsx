export default function PaymentSkeleton() {
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
					<div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
					<div className="flex flex-col gap-4 lg:flex-row">
						<div className="h-10 flex-1 animate-pulse rounded bg-gray-200" />
						<div className="flex gap-2">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="h-10 w-32 animate-pulse rounded bg-gray-200" />
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Transactions Skeleton */}
			<div className="rounded-lg bg-white shadow-sm">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="border-b p-6 last:border-b-0">
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1 space-y-3">
								<div className="flex items-center gap-3">
									<div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
									<div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
								</div>
								<div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
								<div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
							</div>
							<div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
