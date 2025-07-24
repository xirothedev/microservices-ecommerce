import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getFallbackString(string: string) {
	return string
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();
}
