import { useCallback, useState } from "react";

export interface PaymentMethod {
	id: string;
	name: string;
	description: string;
	icon: React.ReactNode;
	color: string;
	details: string;
	requiresCard?: boolean;
}

export interface OrderData {
	id: string;
	items: any[];
	payment: {
		method: string;
		amount: number;
	};
	timestamp: string;
	subtotal: number;
	shipping: number;
	tax: number;
	total: number;
	status: "completed" | "failed" | "pending";
}

export interface PaymentError {
	field?: string;
	message: string;
}

export function usePayment() {
	const [isProcessing, setIsProcessing] = useState(false);
	const [errors, setErrors] = useState<PaymentError[]>([]);

	const processPayment = useCallback(async (paymentMethod: string): Promise<boolean> => {
		// Simulate QR code payment processing
		await new Promise((resolve) => setTimeout(resolve, 3000));
		return Math.random() > 0.05; // 95% success rate
	}, []);

	const saveOrderData = useCallback((orderData: OrderData) => {
		try {
			localStorage.setItem("lastOrder", JSON.stringify(orderData));
		} catch (error) {
			console.error("Error saving order data:", error);
		}
	}, []);

	const clearErrors = useCallback(() => {
		setErrors([]);
	}, []);

	const addError = useCallback((error: PaymentError) => {
		setErrors((prev) => [...prev, error]);
	}, []);

	const removeError = useCallback((field: string) => {
		setErrors((prev) => prev.filter((error) => error.field !== field));
	}, []);

	const getFieldError = useCallback(
		(field: string): string | undefined => {
			return errors.find((error) => error.field === field)?.message;
		},
		[errors],
	);

	const hasErrors = useCallback((): boolean => {
		return errors.length > 0;
	}, [errors]);

	return {
		isProcessing,
		setIsProcessing,
		errors,
		processPayment,
		saveOrderData,
		clearErrors,
		addError,
		removeError,
		getFieldError,
		hasErrors,
	};
}
