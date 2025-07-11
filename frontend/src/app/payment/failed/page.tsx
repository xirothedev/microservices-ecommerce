"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { WavyBackground } from "@/components/ui/wavy-background";

export default function PaymentFailedPage() {
	const commonIssues = [
		"Insufficient funds in your account",
		"Card expired or blocked",
		"Network connection issues",
		"Payment method not supported",
		"Bank security restrictions",
	];

	return (
		<WavyBackground className="max-w-4xl mx-auto">
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="text-center"
			>
				<Card className="border-0 shadow-2xl">
					<CardHeader className="pb-4">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="mx-auto mb-4"
						>
							<XCircle className="h-20 w-20 text-red-500" />
						</motion.div>
						<CardTitle className="mb-2 text-3xl font-bold text-gray-900">Payment Failed</CardTitle>
						<p className="text-lg text-gray-600">We couldn't process your payment. Please try again.</p>
					</CardHeader>

					<CardContent className="space-y-6">
						<div className="rounded-lg bg-red-50 p-6 text-left">
							<h3 className="mb-3 font-semibold text-red-800">Common reasons for payment failure:</h3>
							<ul className="space-y-1 text-sm text-red-700">
								{commonIssues.map((issue, index) => (
									<li key={index}>• {issue}</li>
								))}
							</ul>
						</div>

						<div className="rounded-lg bg-blue-50 p-6">
							<h3 className="mb-2 font-semibold text-blue-800">What you can do:</h3>
							<ul className="space-y-1 text-sm text-blue-700">
								<li>• Check your payment details and try again</li>
								<li>• Try a different payment method</li>
								<li>• Contact your bank if the issue persists</li>
								<li>• Reach out to our support team for help</li>
							</ul>
						</div>

						<div className="flex flex-col gap-4 sm:flex-row">
							<Link href="/payment" className="flex-1">
								<Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
									<RefreshCw className="mr-2 h-4 w-4" />
									Try Again
								</Button>
							</Link>
							<Link href="/cart" className="flex-1">
								<Button size="lg" variant="outline" className="w-full bg-transparent">
									<ArrowLeft className="mr-2 h-4 w-4" />
									Back to Cart
								</Button>
							</Link>
						</div>

						<div className="space-y-3 border-t pt-4">
							<Link href="/support">
								<Button variant="link" className="text-blue-600 hover:text-blue-700">
									<HelpCircle className="mr-1 h-4 w-4" />
									Contact Support
								</Button>
							</Link>
							<p className="text-center text-xs text-gray-500">
								Support team available 24/7 at support@digitalpro.com
							</p>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</WavyBackground>
	);
}
