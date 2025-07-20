export default function TicketsSkeleton() {
	return (
		<div className="space-y-6">
			{/* Form Skeleton */}
			<div className="rounded-lg bg-white p-6 shadow-sm">
				{/* Header */}
				<div className="mb-6 space-y-2">
					<div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
					<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
				</div>

				{/* Form Fields */}
				<div className="space-y-6">
					{/* Basic Info Row */}
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-2">
							<div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
							<div className="h-10 animate-pulse rounded bg-gray-200" />
						</div>
						<div className="space-y-2">
							<div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
							<div className="h-10 animate-pulse rounded bg-gray-200" />
						</div>
					</div>

					{/* Priority Selection */}
					<div className="space-y-2">
						<div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
						<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="h-16 animate-pulse rounded bg-gray-200" />
							))}
						</div>
					</div>

					{/* Rich Text Editor */}
					<div className="space-y-2">
						<div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
						<div className="rounded-lg border">
							<div className="h-12 animate-pulse border-b bg-gray-100" />
							<div className="h-32 animate-pulse bg-gray-50" />
						</div>
					</div>

					{/* Context Selector */}
					<div className="space-y-2">
						<div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
						<div className="h-10 animate-pulse rounded bg-gray-200" />
					</div>

					{/* Image Upload */}
					<div className="space-y-2">
						<div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
						<div className="h-32 animate-pulse rounded-lg border-2 border-dashed border-gray-200 bg-gray-100" />
					</div>

					{/* Submit Button */}
					<div className="flex justify-end">
						<div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
					</div>
				</div>
			</div>
		</div>
	);
}
