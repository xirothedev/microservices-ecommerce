"use client";

import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, X, RefreshCw, Clock } from "lucide-react";

interface OrderStatusBadgeProps {
	status: string;
	className?: string;
}

// Status mapping for display
const statusConfig = {
	PENDING: {
		label: "Pending",
		color: "bg-yellow-500 hover:bg-yellow-600",
		icon: Clock,
		textColor: "text-white",
	},
	DONE: {
		label: "Completed",
		color: "bg-green-500 hover:bg-green-600",
		icon: CheckCircle,
		textColor: "text-white",
	},
	CANCELLED: {
		label: "Cancelled",
		color: "bg-red-500 hover:bg-red-600",
		icon: X,
		textColor: "text-white",
	},
	REFUNDED: {
		label: "Refunded",
		color: "bg-blue-500 hover:bg-blue-600",
		icon: RefreshCw,
		textColor: "text-white",
	},
	FAILED: {
		label: "Failed",
		color: "bg-red-600 hover:bg-red-700",
		icon: AlertCircle,
		textColor: "text-white",
	},
} as const;

export function OrderStatusBadge({ status, className = "" }: OrderStatusBadgeProps) {
	const config = statusConfig[status as keyof typeof statusConfig];

	if (!config) {
		return (
			<Badge variant="secondary" className={className}>
				<AlertCircle className="mr-1 h-3 w-3" />
				Unknown
			</Badge>
		);
	}

	const Icon = config.icon;

	return (
		<Badge variant="secondary" className={`${config.color} ${config.textColor} ${className}`}>
			<Icon className="mr-1 h-3 w-3" />
			{config.label}
		</Badge>
	);
}
