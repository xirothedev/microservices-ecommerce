import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { ChatMessageHistoryDto } from './dto/chat-message.dto';

export interface GeminiResponse {
  content: string;
  error?: string;
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly genAI: GoogleGenAI;
  private readonly modelName = 'gemini-2.0-flash-001';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');

    this.genAI = new GoogleGenAI({ apiKey });
  }

  /**
   * Check if Gemini is properly configured
   */
  isConfigured(): boolean {
    return !!this.genAI;
  }

  /**
   * Generate a response using Gemini AI for customer support chat
   */
  async generateChatResponse(
    userMessage: string,
    conversationHistory: ChatMessageHistoryDto[] = [],
  ): Promise<GeminiResponse> {
    try {
      // Create system prompt with conversation context
      let prompt = `You are a helpful customer support assistant for a web platform. 
Your role is to:
- Provide friendly, professional customer support
- Answer questions about pricing, features, support, trials, and demos
- Keep responses concise and helpful (2-3 sentences max)
- If you don't know something specific, offer to connect them with a human agent
- Be conversational and empathetic

`;

      // Add conversation history for context
      if (conversationHistory.length > 0) {
        prompt += 'Previous conversation:\n';
        const recentHistory = conversationHistory.slice(-4);
        for (const msg of recentHistory) {
          prompt += `${msg.role}: ${msg.content}\n`;
        }
        prompt += '\n';
      }

      prompt += `User: ${userMessage}\n\nAssistant:`;

      // Generate content using the new API structure
      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: prompt,
      });

      const text = response.text;

      this.logger.log(`Generated response for user message: "${userMessage.substring(0, 50)}..."`);

      return {
        content: text?.trim() || '',
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
