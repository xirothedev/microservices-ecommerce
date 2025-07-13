import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import { loadEsm } from 'load-esm';
import { unlink } from 'node:fs/promises';
import { Readable } from 'node:stream';

const MAX_RETRIES = 3;
const MAX_CONCURRENT_UPLOADS = 3;

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow('CLOUDINARY_API_SECRET'),
    });
  }

  public async convertBufferToFile(buffer: Buffer): Promise<Express.Multer.File> {
    const { fileTypeFromBuffer } = await loadEsm('file-type');

    const mineType = await fileTypeFromBuffer(buffer);

    return {
      buffer,
      fieldname: 'file',
      originalname: `file.${mineType.ext}`,
      encoding: '7bit',
      mimetype: mineType?.mime,
      size: buffer.length,
      stream: Readable.from(buffer),
      destination: '',
      filename: `file.${mineType.ext}`,
      path: '',
    };
  }

  public async uploadFile(file: Express.Multer.File, options?: UploadApiOptions) {
    try {
      const result = await cloudinary.uploader.upload(file.path, options);

      await this.prismaService.media.create({
        data: {
          id: result.public_id,
          secure_url: result.secure_url,
          url: result.url,
          width: result.width,
          height: result.height,
          format: result.format,
          resourceType: result.resource_type,
          originalName: file.originalname,
        },
      });

      // Clean up the local file after successful upload
      await unlink(file.path);

      return result.secure_url;
    } catch (error) {
      // Clean up the local file in case of error
      await unlink(file.path);
      throw new Error(error);
    }
  }

  public getFile(url: string) {
    return this.prismaService.media.findUnique({
      where: {
        secure_url: url,
      },
    });
  }

  public async deleteFile(url: string) {
    try {
      const media = await this.getFile(url);
      if (!media) throw new Error('Media not found');

      const result = await cloudinary.uploader.destroy(media.id);
      if (result.result === 'ok') {
        await this.prismaService.media.delete({
          where: {
            id: media.id,
          },
        });

        return true;
      }
      throw new Error('Failed to delete media');
    } catch (error) {
      throw new Error(error);
    }
  }

  public async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    const chunks = this.chunkArray(files, MAX_CONCURRENT_UPLOADS);
    const results: string[] = [];

    for (const chunk of chunks) {
      const uploadPromises = chunk.map((file) => this.uploadFileWithRetry(file));
      const chunkResults = await Promise.all(uploadPromises);
      results.push(...chunkResults.filter((url) => url !== null));
    }

    return results;
  }

  private async uploadFileWithRetry(file: Express.Multer.File): Promise<string> {
    let lastError: Error = new Error();

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await this.uploadFile(file);
        return result;
      } catch (error) {
        lastError = error;
        this.logger.warn(`Upload attempt ${attempt} failed: ${error.message}`);

        if (attempt < MAX_RETRIES) {
          await this.delay(1000 * attempt); // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  public async uploadSquareImage(file: Express.Multer.File) {
    return this.uploadFile(file, {
      transformation: [{ width: 500, height: 500, crop: 'fill' }],
    });
  }

  public async deleteMultipleFile(urls: string[]) {
    return Promise.all(urls.map((url) => this.deleteFile(url)));
  }

  public async updateFiles(medias: string[], deletedUrls?: string[], newFiles?: Express.Multer.File[]) {
    let mediaToDelete: string[] = [];
    let mediaToAdd: string[] = [];

    // Delete old media if provided
    if (deletedUrls?.length) {
      mediaToDelete = deletedUrls.filter((url) => medias.includes(url));
      try {
        await this.deleteMultipleFile(mediaToDelete);
      } catch (error) {
        if (this.configService.get('NODE_ENV') === 'development') {
          console.error(error);
        }
        throw new Error('Failed to delete images');
      }
    }

    // Upload new media if provided
    if (newFiles?.length) {
      try {
        mediaToAdd = await this.uploadMultipleFiles(newFiles);
      } catch (error) {
        if (this.configService.get('NODE_ENV') === 'development') {
          console.error(error);
        }
        throw new Error('Failed to upload images');
      }
    }

    return { mediaToDelete, mediaToAdd };
  }

  public async ping() {
    try {
      const data = await cloudinary.api.ping();
      return data.status === 'ok' ? 'Connected' : 'Disconnected';
    } catch {
      return 'Disconnected';
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
