export default function ServicesLoading() {
	return (
		<>
			<div className="h-16 animate-pulse rounded-lg bg-white" />
			<div className="space-y-8">
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
						<div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
					</div>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, index) => (
						<div key={index} className="overflow-hidden rounded-lg bg-white shadow-md">
							{/* Image skeleton */}
							<div className="aspect-[4/3] animate-pulse bg-gray-200" />

							{/* Content skeleton */}
							<div className="space-y-4 p-6">
								<div className="space-y-2">
									<div className="h-6 animate-pulse rounded bg-gray-200" />
									<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
									<div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
								</div>

								<div className="flex gap-2">
									<div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
									<div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
									<div className="h-6 w-14 animate-pulse rounded bg-gray-200" />
								</div>

								<div className="flex items-center gap-2">
									<div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
									<div className="h-6 w-12 animate-pulse rounded bg-gray-200" />
								</div>

								<div className="space-y-2">
									<div className="h-10 animate-pulse rounded bg-gray-200" />
									<div className="h-10 animate-pulse rounded bg-gray-200" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
