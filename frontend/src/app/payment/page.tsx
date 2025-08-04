"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/api/cart";
import { ArrowLeft, CreditCard, Lock, QrCode, Shield, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PaymentContent() {
	const router = useRouter();
	const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
	const [selectedPayment, setSelectedPayment] = useState("momo");
	const [isProcessing, setIsProcessing] = useState(false);
	const [customerInfo, setCustomerInfo] = useState({
		email: "",
		phone: "",
		name: "",
	});

	const totalItems = getTotalItems();
	const subtotal = getTotalPrice();
	const shipping = subtotal > 500 ? 0 : 50;
	const tax = subtotal * 0.1;
	const total = subtotal + shipping + tax;

	const paymentMethods = [
		{
			id: "momo",
			name: "MoMo E-Wallet",
			description: "Pay with MoMo mobile wallet",
			icon: <Smartphone className="h-5 w-5" />,
			color: "bg-pink-500",
		},
		{
			id: "vietqr",
			name: "VietQR",
			description: "Scan QR code to pay via banking app",
			icon: <QrCode className="h-5 w-5" />,
			color: "bg-blue-500",
		},
		{
			id: "paypal",
			name: "PayPal",
			description: "Pay with your PayPal account",
			icon: <CreditCard className="h-5 w-5" />,
			color: "bg-blue-600",
		},
	];

	const handlePayment = async () => {
		if (!customerInfo.email || !customerInfo.phone || !customerInfo.name) {
			alert("Please fill in all required fields");
			return;
		}

		setIsProcessing(true);

		// Simulate payment processing
		await new Promise((resolve) => setTimeout(resolve, 3000));

		// Simulate payment success/failure (80% success rate)
		const isSuccess = Math.random() > 0.2;

		// Store order data in localStorage for billing page
		const orderData = {
			id: `ORD-${Date.now()}`,
			items,
			customer: customerInfo,
			payment: {
				method: selectedPayment,
				amount: total,
			},
			timestamp: new Date().toISOString(),
			subtotal,
			shipping,
			tax,
			total,
		};

		localStorage.setItem("lastOrder", JSON.stringify(orderData));

		if (isSuccess) {
			clearCart();
			router.push("/payment/success");
		} else {
			router.push("/payment/failed");
		}
	};

	if (items.length === 0) {
		return (
			<div className="py-16 text-center">
				<div className="mx-auto max-w-md">
					<h1 className="mb-4 text-3xl font-bold text-gray-900">No items to checkout</h1>
					<p className="mb-8 text-gray-600">Your cart is empty. Add some services to proceed with payment.</p>
					<Link href="/services">
						<Button size="lg" className="bg-blue-600 hover:bg-blue-700">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Browse Services
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
							<h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
							<p className="mt-2 text-gray-600">Complete your purchase securely</p>
						</div>
						<Link href="/cart">
							<Button variant="outline" className="bg-transparent">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Cart
							</Button>
						</Link>
					</div>

					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						{/* Payment Form */}
						<div className="space-y-6 lg:col-span-2">
							{/* Customer Information */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Shield className="h-5 w-5 text-green-500" />
										Customer Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<Label htmlFor="name">Full Name *</Label>
											<Input
												id="name"
												placeholder="Enter your full name"
												value={customerInfo.name}
												onChange={(e) =>
													setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
												}
											/>
										</div>
										<div>
											<Label htmlFor="email">Email Address *</Label>
											<Input
												id="email"
												type="email"
												placeholder="Enter your email"
												value={customerInfo.email}
												onChange={(e) =>
													setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))
												}
											/>
										</div>
									</div>
									<div>
										<Label htmlFor="phone">Phone Number *</Label>
										<Input
											id="phone"
											placeholder="Enter your phone number"
											value={customerInfo.phone}
											onChange={(e) =>
												setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))
											}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Payment Methods */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Lock className="h-5 w-5 text-blue-500" />
										Payment Method
									</CardTitle>
								</CardHeader>
								<CardContent>
									<RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
										<div className="space-y-3">
											{paymentMethods.map((method) => (
												<div
													key={method.id}
													className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50"
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
										{selectedPayment === "momo" && (
											<div className="text-center">
												<div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-white">
													<div className="text-4xl font-bold text-pink-500">MoMo</div>
												</div>
												<p className="text-sm text-gray-600">
													You will be redirected to MoMo app to complete the payment
												</p>
											</div>
										)}
										{selectedPayment === "vietqr" && (
											<div className="text-center">
												<div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-white">
													<QrCode className="h-16 w-16 text-blue-500" />
												</div>
												<p className="text-sm text-gray-600">
													Scan QR code with your banking app to pay
												</p>
											</div>
										)}
										{selectedPayment === "paypal" && (
											<div className="text-center">
												<div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-white">
													<div className="text-2xl font-bold text-blue-600">PayPal</div>
												</div>
												<p className="text-sm text-gray-600">
													You will be redirected to PayPal to complete the payment
												</p>
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
									<CardTitle>Order Summary</CardTitle>
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
														<Badge variant="secondary" className="text-xs">
															{item.category}
														</Badge>
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
											<span>Subtotal ({totalItems} items)</span>
											<span>${subtotal.toFixed(2)}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Shipping</span>
											<span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Tax</span>
											<span>${tax.toFixed(2)}</span>
										</div>
										<Separator />
										<div className="flex justify-between text-lg font-semibold">
											<span>Total</span>
											<span>${total.toFixed(2)}</span>
										</div>
									</div>

									<Button
										size="lg"
										className="w-full bg-blue-600 hover:bg-blue-700"
										onClick={handlePayment}
										disabled={isProcessing}
									>
										{isProcessing ? "Processing Payment..." : `Pay $${total.toFixed(2)}`}
									</Button>

									<div className="text-center">
										<p className="text-xs text-gray-500">
											🔒 Your payment information is secure and encrypted
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
