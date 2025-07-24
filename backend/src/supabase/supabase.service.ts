import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseConfig } from './supabase.interface';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly BUCKET_NAME = 'cdn';
  private supabase: SupabaseClient;
  private config: SupabaseConfig;
  private rootPath: string;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      url: this.configService.getOrThrow<string>('SUPABASE_PROJECT_URL'),
      key: this.configService.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
      options: {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      },
    };

    this.rootPath = `${this.config.url}/storage/v1/object/public/cdn/`;
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

  public getClient(): SupabaseClient {
    return this.supabase;
  }

  public isInitialized(): boolean {
    return !!this.supabase;
  }

  public async uploadFile(
    file: Express.Multer.File,
    options?: { contentType?: string },
  ): Promise<{ data: any; path: string; error: any }> {
    const path = `${Date.now()}-${file.originalname}`;
    const fullPath = this.getPublicUrl(path);

    try {
      const { data, error } = await this.supabase.storage.from(this.BUCKET_NAME).upload(path, file.buffer, options);

      if (error) {
        this.logger.error('Upload error for bucket:', error);
      } else {
        this.logger.log(`File uploaded successfully to ${path}`);
      }

      return { data, path: fullPath, error };
    } catch (error) {
      this.logger.error('Upload exception for bucket:', error);
      return { data: null, path: fullPath, error };
    }
  }

  public async downloadFile(path: string): Promise<{ data: Blob | null; error: any }> {
    try {
      const { data, error } = await this.supabase.storage.from(this.BUCKET_NAME).download(path);

      if (error) {
        this.logger.error('Download error for bucket:', error);
      }

      return { data, error };
    } catch (error) {
      this.logger.error('Download exception for bucket:', error);
      return { data: null, error };
    }
  }

  public async deleteFile(fullPath: string): Promise<{ data: any; error: any }> {
    const path = this.extractUrl(fullPath);
    if (!path) {
      return { data: null, error: 'Path do not match for cdn url' };
    }

    try {
      const { data, error } = await this.supabase.storage.from(this.BUCKET_NAME).remove([path]);

      if (error) {
        this.logger.error('Delete file error for bucket:', error);
      } else {
        this.logger.log(`File deleted successfully from ${path}`);
      }

      return { data, error };
    } catch (error) {
      this.logger.error('Delete file exception for bucket:', error);
      return { data: null, error };
    }
  }

  // private helper
  private getPublicUrl(path: string): string {
    return `${this.rootPath}${path}`;
  }

  private extractUrl(url: string): string | null {
    const match = new URL(url).pathname.match(/\/cdn\/(.+)$/);
    return match ? match[1] : null;
  }
}
