"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/api/cart";
import { AlertCircle, ArrowLeft, Loader2, Lock, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PaymentProcessorProps {
	onPaymentComplete?: (orderData: any) => void;
	onPaymentError?: (error: string) => void;
}

interface PaymentMethod {
	id: string;
	name: string;
	description: string;
	icon: React.ReactNode;
	color: string;
	details: string;
	requiresCard?: boolean;
}

export default function PaymentProcessor({ onPaymentComplete, onPaymentError }: PaymentProcessorProps) {
	const router = useRouter();
	const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
	const [selectedPayment, setSelectedPayment] = useState("vietqr");
	const [isProcessing, setIsProcessing] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const totalItems = getTotalItems();
	const subtotal = getTotalPrice();
	const shipping = subtotal > 500 ? 0 : 50;
	const tax = subtotal * 0.1;
	const total = subtotal + shipping + tax;

	const paymentMethods: PaymentMethod[] = [
		{
			id: "vietqr",
			name: "VietQR",
			description: "Quét mã QR để thanh toán qua ứng dụng ngân hàng",
			icon: <QrCode className="h-5 w-5" />,
			color: "bg-blue-500",
			details: "Quét mã QR bằng ứng dụng ngân hàng để thanh toán",
		},
	];

	const validateForm = () => {
		// No validation needed since we removed customer info form
		return true;
	};

	const processPayment = async () => {
		// Simulate QR code payment processing
		await new Promise((resolve) => setTimeout(resolve, 3000));
		return Math.random() > 0.05; // 95% success rate
	};

	const handlePayment = async () => {
		if (!validateForm()) {
			return;
		}

		setIsProcessing(true);
		setErrors({});

		try {
			// Process payment
			const isSuccess = await processPayment();

			// Store order data in localStorage for billing page
			const orderData = {
				id: `ORD-${Date.now()}`,
				items,
				payment: {
					method: selectedPayment,
					amount: total,
				},
				timestamp: new Date().toISOString(),
				subtotal,
				shipping,
				tax,
				total,
				status: isSuccess ? "completed" : "failed",
			};

			localStorage.setItem("lastOrder", JSON.stringify(orderData));

			if (onPaymentComplete) {
				onPaymentComplete(orderData);
			}

			if (isSuccess) {
				clearCart();
				router.push("/payment/success");
			} else {
				router.push("/payment/failed");
			}
		} catch (error) {
			console.error("Payment error:", error);
			const errorMessage = "Payment processing failed. Please try again.";
			setErrors({ general: errorMessage });
			if (onPaymentError) {
				onPaymentError(errorMessage);
			}
		} finally {
			setIsProcessing(false);
		}
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

	const selectedMethod = paymentMethods.find((m) => m.id === selectedPayment);

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
									<RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
										<div className="space-y-3">
											{paymentMethods.map((method) => (
												<div
													key={method.id}
													className="flex cursor-pointer items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50"
													onClick={() => setSelectedPayment(method.id)}
												>
													<RadioGroupItem value={method.id} id={method.id} />
													<div className={`rounded-lg p-2 text-white ${method.color}`}>
														{method.icon}
													</div>
													<div className="flex-1">
														<Label
															htmlFor={method.id}
															className="cursor-pointer font-medium"
														>
															{method.name}
														</Label>
														<p className="text-sm text-gray-500">{method.description}</p>
													</div>
												</div>
											))}
										</div>
									</RadioGroup>

									{/* Payment Method Details */}
									<div className="mt-6 rounded-lg bg-blue-50 p-4">
										<div className="text-center">
											<div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-white p-4">
												<QrCode className="h-24 w-24 text-blue-500" />
											</div>
											<p className="text-sm text-gray-700">{selectedMethod?.details}</p>
											<p className="mt-2 text-xs text-gray-500">
												Quét mã QR này bằng ứng dụng ngân hàng để hoàn tất thanh toán
											</p>
										</div>
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
														${(item.price * item.quantity).toFixed(2)}
													</p>
												</div>
											</div>
										))}
									</div>

									<Separator />

									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Tạm tính ({totalItems} sản phẩm)</span>
											<span>${subtotal.toFixed(2)}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Vận chuyển</span>
											<span>{shipping === 0 ? "Miễn phí" : `$${shipping.toFixed(2)}`}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Thuế</span>
											<span>${tax.toFixed(2)}</span>
										</div>
										<Separator />
										<div className="flex justify-between text-lg font-semibold">
											<span>Tổng cộng</span>
											<span>${total.toFixed(2)}</span>
										</div>
									</div>

									<Button
										size="lg"
										className="w-full bg-blue-600 hover:bg-blue-700"
										onClick={handlePayment}
										disabled={isProcessing}
									>
										{isProcessing ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Đang xử lý thanh toán...
											</>
										) : (
											`Thanh toán $${total.toFixed(2)}`
										)}
									</Button>

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
