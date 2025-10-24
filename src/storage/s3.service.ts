import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>('S3_BUCKET_NAME') || 'ecommerce-storage';

    this.s3Client = new S3Client({
      endpoint:
        this.configService.get<string>('S3_ENDPOINT') ||
        'http://localhost:9000',
      region: this.configService.get<string>('S3_REGION') || 'us-east-1',
      credentials: {
        accessKeyId:
          this.configService.get<string>('S3_ACCESS_KEY') || 'minioadmin',
        secretAccessKey:
          this.configService.get<string>('S3_SECRET_KEY') || 'minioadmin123',
      },
      forcePathStyle: true, // Required for MinIO
    });
  }

  async uploadFile(
    key: string,
    file: Express.Multer.File,
    contentType?: string,
  ): Promise<{ url: string; key: string }> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: contentType || file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.s3Client.send(command);

      const url = `${this.configService.get<string>('S3_ENDPOINT')}/${this.bucketName}/${key}`;

      this.logger.log(`File uploaded successfully: ${key}`);

      return { url, key };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${key}`, error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async getFile(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const chunks: Uint8Array[] = [];

      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      this.logger.error(`Failed to get file: ${key}`, error);
      throw new Error(`Failed to get file: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${key}`, error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  async generatePresignedUrl(
    key: string,
    expiresIn: number = 3600,
    operation: 'getObject' | 'putObject' = 'getObject',
  ): Promise<string> {
    try {
      const command =
        operation === 'getObject'
          ? new GetObjectCommand({ Bucket: this.bucketName, Key: key })
          : new PutObjectCommand({ Bucket: this.bucketName, Key: key });

      const presignedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.log(`Generated presigned URL for ${key}`);
      return presignedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate presigned URL for: ${key}`, error);
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }

  async uploadFromBuffer(
    key: string,
    buffer: Buffer,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<{ url: string; key: string }> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        Metadata: metadata,
      });

      await this.s3Client.send(command);

      const url = `${this.configService.get<string>('S3_ENDPOINT')}/${this.bucketName}/${key}`;

      this.logger.log(`Buffer uploaded successfully: ${key}`);

      return { url, key };
    } catch (error) {
      this.logger.error(`Failed to upload buffer: ${key}`, error);
      throw new Error(`Failed to upload buffer: ${error.message}`);
    }
  }

  // Helper method to generate unique file keys
  generateFileKey(prefix: string, originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${prefix}/${timestamp}-${randomString}.${extension}`;
  }

  // Helper method to get file info
  async getFileInfo(key: string): Promise<any> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      return {
        key,
        size: response.ContentLength,
        contentType: response.ContentType,
        lastModified: response.LastModified,
        metadata: response.Metadata,
      };
    } catch (error) {
      this.logger.error(`Failed to get file info: ${key}`, error);
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }
}
