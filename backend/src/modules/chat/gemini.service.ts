import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessageHistoryDto } from './dto/chat-message.dto';

export interface GeminiResponse {
  content: string;
  error?: string;
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      this.logger.warn('Gemini API key not configured. Gemini service will not be available.');
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Check if Gemini is properly configured
   */
  isConfigured(): boolean {
    return !!this.configService.get<string>('GEMINI_API_KEY') && !!this.model;
  }

  /**
   * Generate a response using Gemini AI for customer support chat
   */
  async generateChatResponse(
    userMessage: string,
    conversationHistory: ChatMessageHistoryDto[] = [],
  ): Promise<GeminiResponse> {
    try {
      if (!this.isConfigured()) {
        throw new Error('Gemini API not configured');
      }

      // Create a context-aware prompt for customer support
      const systemPrompt = `You are a helpful customer support assistant for a web platform. 
Your role is to:
- Provide friendly, professional customer support
- Answer questions about pricing, features, support, trials, and demos
- Keep responses concise and helpful (2-3 sentences max)
- If you don't know something specific, offer to connect them with a human agent
- Be conversational and empathetic

Current conversation context:
${conversationHistory
  .slice(-4) // Keep last 4 messages for context
  .map((msg) => `${msg.role}: ${msg.content}`)
  .join('\n')}

User's latest message: ${userMessage}

Please provide a helpful response:`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      this.logger.log(`Generated response for user message: "${userMessage.substring(0, 50)}..."`);

      return {
        content: text.trim(),
      };
    } catch (error) {
      this.logger.error('Gemini API error:', error);

      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate a response with retry logic
   */
  async generateChatResponseWithRetry(
    userMessage: string,
    conversationHistory: ChatMessageHistoryDto[] = [],
    maxRetries: number = 2,
  ): Promise<GeminiResponse> {
    let lastError: string | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const response = await this.generateChatResponse(userMessage, conversationHistory);

      if (!response.error) {
        return response;
      }

      lastError = response.error;

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        this.logger.warn(`Retrying Gemini API call (attempt ${attempt + 2}/${maxRetries + 1})`);
      }
    }

    this.logger.error(`Gemini API failed after ${maxRetries + 1} attempts: ${lastError}`);

    return {
      content: '',
      error: lastError || 'Failed after multiple retries',
    };
  }
}
