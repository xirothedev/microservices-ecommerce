"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
	const searchParams = useSearchParams();
	const message = searchParams.get("message") || "An unexpected error occurred";

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black">
			<div className="shadow-input relative mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black/75">
				{/* Header with back button */}
				<div className="mb-8">
					<Link
						href="/"
						className="text-muted-foreground hover:text-foreground flex items-center text-sm transition-colors"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Homepage
					</Link>
				</div>

				{/* Error Icon and Title */}
				<div className="mb-6 text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
						<AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
					</div>
					<h1 className="mb-2 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
						Oops! Something went wrong
					</h1>
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						We encountered an error while processing your request
					</p>
				</div>

				{/* Error Message */}
				<div className="mb-8 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/10">
					<div className="flex items-start">
						<AlertTriangle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
						<div>
							<h3 className="mb-1 text-sm font-medium text-red-800 dark:text-red-200">Error Details</h3>
							<p className="text-sm break-words text-red-700 dark:text-red-300">{message}</p>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="space-y-4">
					<Button
						asChild
						className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-opacity hover:opacity-90 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
					>
						<Link className="flex items-center justify-center" href="/">
							<Home className="mr-2 h-4 w-4" />
							Go to Homepage
						</Link>
					</Button>

					<Button
						asChild
						variant="outline"
						className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black transition-colors hover:bg-gray-50 dark:bg-zinc-900 dark:text-white dark:shadow-[0px_0px_1px_1px_#262626] dark:hover:bg-zinc-800"
					>
						<button onClick={() => window.history.back()}>
							<ArrowLeft className="h-4 w-4" />
							Go Back
						</button>
					</Button>
				</div>

				{/* Additional Help */}
				<div className="mt-8 text-center">
					<p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
						If this problem persists, please contact our support team
					</p>
					<div className="text-xs text-neutral-400 dark:text-neutral-500">
						Error ID: {Date.now().toString(36).toUpperCase()}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function ErrorPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
					<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-neutral-800 dark:border-neutral-200"></div>
				</div>
			}
		>
			<ErrorContent />
		</Suspense>
	);
}
