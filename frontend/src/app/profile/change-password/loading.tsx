export default function ChangePasswordSkeleton() {
	return (
		<div className="space-y-6">
			{/* Main Form Skeleton */}
			<div className="rounded-lg bg-white p-6 shadow-sm">
				<div className="space-y-6">
					<div className="space-y-2">
						<div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
						<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
					</div>

					{/* Form Fields */}
					<div className="space-y-4">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="space-y-2">
								<div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
								<div className="h-10 animate-pulse rounded bg-gray-200" />
							</div>
						))}
					</div>

					{/* Password Requirements */}
					<div className="space-y-3">
						<div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
						<div className="h-2 animate-pulse rounded bg-gray-200" />
						<div className="grid grid-cols-2 gap-2">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="h-4 animate-pulse rounded bg-gray-200" />
							))}
						</div>
					</div>

					{/* Submit Button */}
					<div className="h-10 animate-pulse rounded bg-gray-200" />
				</div>
			</div>

			{/* Security Cards Skeleton */}
			<div className="grid gap-6 md:grid-cols-2">
				{[...Array(2)].map((_, i) => (
					<div key={i} className="rounded-lg bg-white p-6 shadow-sm">
						<div className="space-y-4">
							<div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
							<div className="space-y-2">
								{[...Array(4)].map((_, j) => (
									<div key={j} className="h-4 animate-pulse rounded bg-gray-200" />
								))}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
