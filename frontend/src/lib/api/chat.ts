import axiosInstance from "../axios";

export interface ChatMessage {
	role: "user" | "assistant";
	content: string;
}

export interface ChatResponse {
	content: string;
	error?: string;
	timestamp: string;
}

export interface ChatStatusResponse {
	aiEnabled: boolean;
	timestamp: string;
}

/**
 * Send a chat message to the backend and get a response
 */
export async function sendChatMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<ChatResponse> {
	try {
		const response = await axiosInstance.post<ChatResponse>("/chat/message", {
			message,
			conversationHistory,
		});

		return response.data;
	} catch (error) {
		console.error("Chat API error:", error);

		// Return a fallback response
		return {
			content: "Sorry, I'm having trouble connecting to our support system. Please try again in a moment.",
			error: error instanceof Error ? error.message : "Network error",
			timestamp: new Date().toISOString(),
		};
	}
}

/**
 * Check if AI-powered responses are available
 */
export async function getChatStatus(): Promise<ChatStatusResponse> {
	try {
		const response = await axiosInstance.get<ChatStatusResponse>("/chat/status");
		return response.data;
	} catch (error) {
		console.error("Chat status API error:", error);

		// Return fallback status
		return {
			aiEnabled: false,
			timestamp: new Date().toISOString(),
		};
	}
}
