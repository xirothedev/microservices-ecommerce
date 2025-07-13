"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WavyBackground } from "@/components/ui/wavy-background";
import { ArrowRight, CheckCircle, Download, Home } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
	const router = useRouter();
	const [countdown, setCountdown] = useState(10);

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					router.push("/billing");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [router]);

	return (
		<WavyBackground className="mx-auto max-w-4xl">
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
							<CheckCircle className="h-20 w-20 text-green-500" />
						</motion.div>
						<CardTitle className="mb-2 text-3xl font-bold text-gray-900">Payment Successful!</CardTitle>
						<p className="text-lg text-gray-600">
							Thank you for your purchase. Your order has been confirmed.
						</p>
					</CardHeader>

					<CardContent className="space-y-6">
						<div className="rounded-lg bg-green-50 p-6">
							<h3 className="mb-2 font-semibold text-green-800">What happens next?</h3>
							<ul className="space-y-1 text-sm text-green-700">
								<li>• You&apos;ll receive an email confirmation shortly</li>
								<li>• Our team will start working on your services</li>
								<li>• You can track progress in your dashboard</li>
								<li>• We&apos;ll notify you of any updates</li>
							</ul>
						</div>

						<div className="flex flex-col gap-4 sm:flex-row">
							<Link href="/billing" className="flex-1">
								<Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
									<Download className="mr-2 h-4 w-4" />
									View Invoice
								</Button>
							</Link>
							<Link href="/" className="flex-1">
								<Button size="lg" variant="outline" className="w-full bg-transparent">
									<Home className="mr-2 h-4 w-4" />
									Go Home
								</Button>
							</Link>
						</div>

						<div className="text-center">
							<p className="mb-2 text-sm text-gray-500">
								Redirecting to your invoice in {countdown} seconds...
							</p>
							<Link href="/billing">
								<Button variant="link" className="text-blue-600 hover:text-blue-700">
									Go to Invoice Now
									<ArrowRight className="ml-1 h-4 w-4" />
								</Button>
							</Link>
						</div>

						<div className="border-t pt-4">
							<p className="text-center text-xs text-gray-500">
								Need help? Contact our support team at support@digitalpro.com
							</p>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</WavyBackground>
	);
}
