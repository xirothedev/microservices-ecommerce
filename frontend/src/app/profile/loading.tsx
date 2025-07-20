export default function ProfileLayoutSkeleton() {
	return (
		<div className="grid gap-8 lg:grid-cols-4">
			<div className="lg:col-span-1">
				<div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
					<div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-gray-200" />
					<div className="h-4 animate-pulse rounded bg-gray-200" />
					<div className="mx-auto h-3 w-3/4 animate-pulse rounded bg-gray-200" />
					<div className="space-y-2 pt-4">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="h-10 animate-pulse rounded bg-gray-200" />
						))}
					</div>
				</div>
			</div>
			<div className="lg:col-span-3">
				<div className="rounded-lg bg-white p-6 shadow-sm">
					<div className="mb-6 h-8 w-1/3 animate-pulse rounded bg-gray-200" />
					<div className="space-y-4">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="h-16 animate-pulse rounded bg-gray-200" />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
