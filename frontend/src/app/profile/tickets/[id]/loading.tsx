export default function TicketDetailSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header Skeleton */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
					<div className="space-y-2">
						<div className="h-8 w-96 animate-pulse rounded bg-gray-200" />
						<div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
					<div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Main Content Skeleton */}
				<div className="space-y-6 lg:col-span-2">
					{/* Ticket Details Skeleton */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="space-y-4">
							<div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
							<div className="space-y-2">
								<div className="h-4 w-full animate-pulse rounded bg-gray-200" />
								<div className="h-4 w-full animate-pulse rounded bg-gray-200" />
								<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
							</div>
							<div className="space-y-2">
								<div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
								<div className="flex gap-2">
									<div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
									<div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
								</div>
							</div>
						</div>
					</div>

					{/* Chat Interface Skeleton */}
					<div className="rounded-lg bg-white shadow-sm">
						<div className="border-b p-6">
							<div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
						</div>
						<div className="h-96 animate-pulse bg-gray-50" />
					</div>
				</div>

				{/* Sidebar Skeleton */}
				<div className="space-y-6">
					{/* Ticket Info Skeleton */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="space-y-4">
							<div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
							<div className="space-y-3">
								<div className="h-4 w-full animate-pulse rounded bg-gray-200" />
								<div className="h-4 w-full animate-pulse rounded bg-gray-200" />
								<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
							</div>
						</div>
					</div>

					{/* Agent Skeleton */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="space-y-4">
							<div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
							<div className="flex items-center gap-3">
								<div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
								<div className="space-y-2">
									<div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
									<div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
								</div>
							</div>
						</div>
					</div>

					{/* Actions Skeleton */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="space-y-4">
							<div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
							<div className="space-y-2">
								<div className="h-9 animate-pulse rounded bg-gray-200" />
								<div className="h-9 animate-pulse rounded bg-gray-200" />
								<div className="h-9 animate-pulse rounded bg-gray-200" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
