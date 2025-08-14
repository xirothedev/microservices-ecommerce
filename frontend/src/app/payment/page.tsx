"use client";

import { PaymentData } from "@/@types/api/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/api/cart";
import { ordersApi } from "@/lib/api/orders";
import { AlertCircle, ArrowLeft, Loader2, Lock, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PaymentPage() {
	const { items, getTotalItems, getTotalPrice } = useCart();
	const [isProcessing, setIsProcessing] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
	const [isGeneratingQR, setIsGeneratingQR] = useState(false);

	const totalItems = getTotalItems();
	const total = getTotalPrice();

	const generateQRCode = async (data: string) => {
		try {
			setIsGeneratingQR(true);
			const QRCode = (await import("qrcode")).default;
			const dataUrl = await QRCode.toDataURL(data, {
				width: 300,
				margin: 2,
				color: {
					dark: "#000000",
					light: "#FFFFFF",
				},
			});
			setQrCodeDataUrl(dataUrl);
		} catch (error) {
			console.error("Failed to generate QR code:", error);
		} finally {
			setIsGeneratingQR(false);
		}
	};

	const createOrder = async () => {
		try {
			setIsProcessing(true);
			setErrors({});

			const { data } = await ordersApi.createOrderFromCart({
				paymentMethod: "VIETQR_PAYOS",
				note: `Order from cart - ${new Date().toLocaleString()}`,
			});

			if (data) {
				setPaymentData(data);
				await generateQRCode(data.qrCode);

				localStorage.setItem(
					"lastOrder",
					JSON.stringify({
						id: data.orderCode,
						items: items.map((item) => ({
							id: item.id,
							title: item.title,
							price: item.price,
							quantity: item.quantity,
							image: item.image,
							category: item.category,
						})),
						payment: {
							method: "VIETQR_PAYOS",
							amount: total,
						},
						timestamp: new Date().toISOString(),
						total,
						status: "pending",
					}),
				);
			} else {
				throw new Error("No payment data received from server");
			}
		} catch (error: any) {
			console.error("Order creation error:", error);

			let errorMessage = "Failed to create order. Please try again.";

			if (error.response?.status === 401) {
				errorMessage = "Bạn cần đăng nhập để tạo đơn hàng. Vui lòng đăng nhập và thử lại.";
			} else if (error.response?.status === 400) {
				errorMessage = error.response?.data?.message || "Dữ liệu đơn hàng không hợp lệ. Vui lòng kiểm tra lại.";
			} else if (error.response?.status === 500) {
				errorMessage = "Lỗi server. Vui lòng thử lại sau.";
			} else if (error.code === "NETWORK_ERROR") {
				errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.";
			} else if (error.message) {
				errorMessage = error.message;
			}

			setErrors({ general: errorMessage });
		} finally {
			setIsProcessing(false);
		}
	};

	const handlePayment = async () => {
		await createOrder();
	};

	if (items.length === 0) {
		return (
			<div className="py-16 text-center">
				<div className="mx-auto max-w-md">
					<AlertCircle className="mx-auto mb-4 h-16 w-16 text-gray-400" />
					<h1 className="mb-4 text-3xl font-bold text-gray-900">Không có sản phẩm để thanh toán</h1>
					<p className="mb-8 text-gray-600">
						Giỏ hàng của bạn trống. Hãy thêm một số dịch vụ để tiến hành thanh toán.
					</p>
					<Link href="/services">
						<Button size="lg" className="bg-blue-600 hover:bg-blue-700">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Duyệt dịch vụ
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 pt-20">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="space-y-8">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Thanh toán QR nhanh chóng</h1>
							<p className="mt-2 text-gray-600">Quét mã QR để hoàn tất mua hàng ngay lập tức</p>
						</div>
						<Link href="/cart">
							<Button variant="outline" className="bg-transparent">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Quay lại giỏ hàng
							</Button>
						</Link>
					</div>

					{/* Error Message */}
					{errors.general && (
						<div className="rounded-lg border border-red-200 bg-red-50 p-4">
							<div className="flex items-center gap-2">
								<AlertCircle className="h-5 w-5 text-red-500" />
								<p className="text-red-700">{errors.general}</p>
							</div>
						</div>
					)}

					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						{/* Payment Form */}
						<div className="space-y-6 lg:col-span-2">
							{/* Payment Methods */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Lock className="h-5 w-5 text-blue-500" />
										Phương thức thanh toán
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										<div className="flex items-center space-x-3 rounded-lg border bg-blue-50 p-4">
											<div className="rounded-lg bg-blue-500 p-2 text-white">
												<QrCode className="h-5 w-5" />
											</div>
											<div className="flex-1">
												<Label className="font-medium text-blue-800">VietQR</Label>
												<p className="text-sm text-blue-600">
													Quét mã QR để thanh toán qua ứng dụng ngân hàng
												</p>
											</div>
										</div>
									</div>

									{/* Helpful Tips */}
									<div className="mt-6 rounded-lg bg-green-50 p-4">
										<h4 className="mb-2 font-semibold text-green-800">
											💡 Hướng dẫn thanh toán VietQR
										</h4>
										<div className="space-y-2 text-sm text-green-700">
											<p>• Phương thức thanh toán: VietQR</p>
											<p>• Nhấn &quot;Tạo đơn hàng&quot; để tạo mã QR</p>
											<p>• Quét mã QR bằng ứng dụng ngân hàng</p>
											<p>• Xác nhận thông tin và hoàn tất thanh toán</p>
											<p>• Sau khi thanh toán xong, nhấn &quot;Đã thanh toán xong&quot;</p>
										</div>
									</div>

									{/* Payment Progress Steps */}
									<div className="mt-6 rounded-lg bg-gray-50 p-4">
										<h4 className="mb-3 font-semibold text-gray-800">
											📋 Các bước thanh toán VietQR
										</h4>
										<div className="space-y-3">
											<div className="flex items-center space-x-3">
												<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
													1
												</div>
												<span className="text-sm text-gray-600">
													Phương thức thanh toán VietQR
												</span>
											</div>
											<div className="flex items-center space-x-3">
												<div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs text-gray-500">
													2
												</div>
												<span className="text-sm text-gray-400">Tạo đơn hàng</span>
											</div>
											<div className="flex items-center space-x-3">
												<div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs text-gray-500">
													3
												</div>
												<span className="text-sm text-gray-400">Quét mã QR</span>
											</div>
											<div className="flex items-center space-x-3">
												<div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs text-gray-500">
													4
												</div>
												<span className="text-sm text-gray-400">Hoàn tất thanh toán</span>
											</div>
										</div>
									</div>

									{/* Payment Method Details */}
									<div className="mt-6 rounded-lg bg-blue-50 p-4">
										{!paymentData ? (
											<div className="text-center">
												<div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-white p-4">
													<QrCode className="h-24 w-24 text-blue-500" />
												</div>
												<p className="text-sm text-gray-700">
													Nhấn &quot;Tạo đơn hàng&quot; để hiển thị mã QR
												</p>
												<p className="mt-2 text-xs text-gray-500">
													Quét mã QR bằng ứng dụng ngân hàng để thanh toán
												</p>
											</div>
										) : (
											<div className="text-center">
												{/* Order Information */}
												{paymentData && (
													<div className="mb-4 rounded-lg bg-white p-3 text-left">
														<h4 className="mb-2 font-semibold text-gray-800">
															Thông tin đơn hàng
														</h4>
														<div className="space-y-1 text-sm text-gray-600">
															<p>
																<span className="font-medium">Mã đơn hàng:</span>{" "}
																{paymentData.orderCode}
															</p>
															<p>
																<span className="font-medium">Phương thức:</span> VietQR
															</p>
															<p>
																<span className="font-medium">Trạng thái:</span>{" "}
																<span className="font-medium text-yellow-600">
																	Chờ thanh toán
																</span>
															</p>
														</div>
													</div>
												)}

												{isGeneratingQR ? (
													<div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-white p-4">
														<Loader2 className="h-24 w-24 animate-spin text-blue-500" />
													</div>
												) : qrCodeDataUrl ? (
													<div className="mx-auto mb-4">
														<Image
															src={qrCodeDataUrl}
															alt="QR Code for payment"
															width={200}
															height={200}
															className="mx-auto rounded-lg border-4 border-white shadow-lg"
														/>
													</div>
												) : (
													<div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-white p-4">
														<QrCode className="h-24 w-24 text-blue-500" />
													</div>
												)}
												<p className="text-sm text-gray-700">
													{isGeneratingQR ? "Đang tạo mã QR..." : "Quét mã QR để thanh toán"}
												</p>
												{!isGeneratingQR && qrCodeDataUrl && (
													<div className="mt-4 space-y-2">
														<Button
															onClick={() => generateQRCode(paymentData.qrCode)}
															variant="outline"
															size="sm"
															className="w-full"
														>
															<QrCode className="mr-2 h-4 w-4" />
															Tạo lại mã QR
														</Button>
														<p className="text-xs text-gray-500">
															Mã QR có hiệu lực trong 15 phút
														</p>
													</div>
												)}
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Order Summary */}
						<div className="space-y-6">
							{/* Order Items */}
							<Card>
								<CardHeader>
									<CardTitle>Tóm tắt đơn hàng</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="max-h-60 space-y-3 overflow-y-auto">
										{items.map((item) => (
											<div key={item.id} className="flex gap-3">
												<div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
													<Image
														src={item.image || "/placeholder.svg?height=48&width=48"}
														alt={item.title}
														fill
														className="object-cover"
													/>
												</div>
												<div className="min-w-0 flex-1">
													<h4 className="truncate text-sm font-medium">{item.title}</h4>
													<div className="mt-1 flex items-center justify-between">
														<span className="text-xs text-gray-500">{item.category}</span>
														<span className="text-sm font-medium">×{item.quantity}</span>
													</div>
													<p className="mt-1 text-sm font-semibold text-blue-600">
														{(item.price * item.quantity).toLocaleString()}đ
													</p>
												</div>
											</div>
										))}
									</div>

									<Separator />

									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Tạm tính ({totalItems} sản phẩm)</span>
											<span>{total.toLocaleString()}đ</span>
										</div>
										<Separator />
										<div className="flex justify-between text-lg font-semibold">
											<span>Tổng cộng</span>
											<span>{total.toLocaleString()}đ</span>
										</div>
									</div>

									{!paymentData && (
										<Button
											size="lg"
											className="w-full bg-blue-600 hover:bg-blue-700"
											onClick={handlePayment}
											disabled={isProcessing}
										>
											{isProcessing ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Đang tạo đơn hàng...
												</>
											) : (
												`Tạo đơn hàng $${total.toFixed(2)}`
											)}
										</Button>
									)}

									<div className="text-center">
										<p className="text-xs text-gray-500">
											🔒 Thông tin thanh toán của bạn được bảo mật và mã hóa
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
