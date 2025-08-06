import { useCallback, useRef } from "react";

export function useThrottle<T extends (...args: any[]) => any>(callback: T, delay: number): T {
	const lastCallRef = useRef<number>(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	return useCallback(
		((...args: Parameters<T>) => {
			const now = Date.now();
			const timeSinceLastCall = now - lastCallRef.current;

			if (timeSinceLastCall >= delay) {
				// Execute immediately if enough time has passed
				lastCallRef.current = now;
				callback(...args);
			} else {
				// Clear existing timeout and set a new one
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}

				timeoutRef.current = setTimeout(() => {
					lastCallRef.current = Date.now();
					callback(...args);
				}, delay - timeSinceLastCall);
			}
		}) as T,
		[callback, delay],
	);
}
