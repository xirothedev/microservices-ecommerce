import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseConfig } from './supabase.interface';

const BUCKET_NAME = 'cdn';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;
  private config: SupabaseConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      url: this.configService.getOrThrow<string>('SUPABASE_PROJECT_URL'),
      key: this.configService.getOrThrow<string>('SUPABASE_PROJECT_API_KEY'),
      options: {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      },
    };
  }

  onModuleInit() {
    try {
      this.supabase = createClient(this.config.url, this.config.key, this.config.options);
      this.logger.log('Supabase client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Supabase client', error);
      throw error;
    }
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async uploadFile(
    file: Express.Multer.File,
    options?: { contentType?: string },
  ): Promise<{ data: any; path: string; error: any }> {
    const path = `${Date.now()}-${file.originalname}`;

    try {
      const { data, error } = await this.supabase.storage.from(BUCKET_NAME).upload(path, file.buffer, options);

      if (error) {
        this.logger.error('Upload error for bucket:', error);
      } else {
        this.logger.log(`File uploaded successfully to ${path}`);
      }

      return { data, path, error };
    } catch (error) {
      this.logger.error('Upload exception for bucket:', error);
      return { data: null, path, error };
    }
  }

  async downloadFile(path: string): Promise<{ data: Blob | null; error: any }> {
    try {
      const { data, error } = await this.supabase.storage.from(BUCKET_NAME).download(path);

      if (error) {
        this.logger.error('Download error for bucket:', error);
      }

      return { data, error };
    } catch (error) {
      this.logger.error('Download exception for bucket:', error);
      return { data: null, error };
    }
  }

  getPublicUrl(path: string): string {
    return `${this.config.url}/storage/v1/object/public/cdn/${path}`;
  }

  async deleteFile(path: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase.storage.from(BUCKET_NAME).remove([path]);

      if (error) {
        this.logger.error('Delete file error for bucket:', error);
      } else {
        this.logger.log(`File deleted successfully from/${path}`);
      }

      return { data, error };
    } catch (error) {
      this.logger.error('Delete file exception for bucket:', error);
      return { data: null, error };
    }
  }

  isInitialized(): boolean {
    return !!this.supabase;
  }
}
