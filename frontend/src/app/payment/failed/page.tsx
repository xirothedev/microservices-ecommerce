"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { WavyBackground } from "@/components/ui/wavy-background";

export default function PaymentFailedPage() {
	const commonIssues = [
		"Tài khoản không đủ tiền",
		"Thẻ đã hết hạn hoặc bị chặn",
		"Vấn đề kết nối mạng",
		"Phương thức thanh toán không được hỗ trợ",
		"Hạn chế bảo mật từ ngân hàng",
	];

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
							<XCircle className="h-20 w-20 text-red-500" />
						</motion.div>
						<CardTitle className="mb-2 text-3xl font-bold text-gray-900">Thanh toán thất bại</CardTitle>
						<p className="text-lg text-gray-600">
							Chúng tôi không thể xử lý thanh toán của bạn. Vui lòng thử lại.
						</p>
					</CardHeader>

					<CardContent className="space-y-6">
						<div className="rounded-lg bg-red-50 p-6 text-left">
							<h3 className="mb-3 font-semibold text-red-800">
								Lý do phổ biến khiến thanh toán thất bại:
							</h3>
							<ul className="space-y-1 text-sm text-red-700">
								{commonIssues.map((issue, index) => (
									<li key={index}>• {issue}</li>
								))}
							</ul>
						</div>

						<div className="rounded-lg bg-blue-50 p-6">
							<h3 className="mb-2 font-semibold text-blue-800">Bạn có thể làm gì:</h3>
							<ul className="space-y-1 text-sm text-blue-700">
								<li>• Kiểm tra thông tin thanh toán và thử lại</li>
								<li>• Thử phương thức thanh toán khác</li>
								<li>• Liên hệ ngân hàng nếu vấn đề vẫn tiếp tục</li>
								<li>• Liên hệ đội ngũ hỗ trợ để được giúp đỡ</li>
							</ul>
						</div>

						<div className="flex flex-col gap-4 sm:flex-row">
							<Link href="/payment" className="flex-1">
								<Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
									<RefreshCw className="mr-2 h-4 w-4" />
									Thử lại
								</Button>
							</Link>
							<Link href="/cart" className="flex-1">
								<Button size="lg" variant="outline" className="w-full bg-transparent">
									<ArrowLeft className="mr-2 h-4 w-4" />
									Quay lại giỏ hàng
								</Button>
							</Link>
						</div>

						<div className="space-y-3 border-t pt-4">
							<Link href="/support">
								<Button variant="link" className="text-blue-600 hover:text-blue-700">
									<HelpCircle className="mr-1 h-4 w-4" />
									Liên hệ hỗ trợ
								</Button>
							</Link>
							<p className="text-center text-xs text-gray-500">
								Đội ngũ hỗ trợ có sẵn 24/7 tại support@digitalpro.com
							</p>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</WavyBackground>
	);
}
