import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSkeleton() {
	return (
		<div className="space-y-8">
			{/* Header Skeleton */}
			<div className="flex items-center justify-between">
				<div>
					<Skeleton className="mb-2 h-8 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>
				<Skeleton className="h-10 w-32" />
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Payment Form Skeleton */}
				<div className="space-y-6 lg:col-span-2">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-48" />
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Skeleton className="mb-2 h-4 w-20" />
									<Skeleton className="h-10 w-full" />
								</div>
								<div>
									<Skeleton className="mb-2 h-4 w-24" />
									<Skeleton className="h-10 w-full" />
								</div>
							</div>
							<div>
								<Skeleton className="mb-2 h-4 w-28" />
								<Skeleton className="h-10 w-full" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent className="space-y-3">
							{[1, 2, 3].map((i) => (
								<div key={i} className="flex items-center space-x-3 rounded-lg border p-4">
									<Skeleton className="h-4 w-4 rounded-full" />
									<Skeleton className="h-8 w-8 rounded-lg" />
									<div className="flex-1">
										<Skeleton className="mb-1 h-4 w-32" />
										<Skeleton className="h-3 w-48" />
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* Summary Skeleton */}
				<div>
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent className="space-y-4">
							{[1, 2, 3].map((i) => (
								<div key={i} className="flex gap-3">
									<Skeleton className="h-12 w-12 rounded-lg" />
									<div className="flex-1">
										<Skeleton className="mb-1 h-4 w-full" />
										<Skeleton className="mb-1 h-3 w-16" />
										<Skeleton className="h-4 w-12" />
									</div>
								</div>
							))}
							<div className="space-y-2 pt-4">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="flex justify-between">
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-4 w-16" />
									</div>
								))}
							</div>
							<Skeleton className="h-12 w-full" />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
