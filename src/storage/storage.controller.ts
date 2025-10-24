import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Query,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { S3Service } from './s3.service';
import type { Response } from 'express';

@Controller('storage')
export class StorageController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('prefix') prefix: string = 'uploads',
  ) {
    if (!file) {
      throw new Error('No file provided');
    }

    const key = this.s3Service.generateFileKey(prefix, file.originalname);
    const result = await this.s3Service.uploadFile(key, file);

    return {
      success: true,
      data: {
        key: result.key,
        url: result.url,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      },
    };
  }

  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    const key = this.s3Service.generateFileKey(
      `avatars/${userId}`,
      file.originalname,
    );
    const result = await this.s3Service.uploadFile(key, file);

    return {
      success: true,
      data: {
        key: result.key,
        url: result.url,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      },
    };
  }

  @Get('file/:key')
  @UseGuards(JwtAuthGuard)
  async getFile(@Param('key') key: string, @Res() res: Response) {
    try {
      const fileBuffer = await this.s3Service.getFile(key);
      const fileInfo = await this.s3Service.getFileInfo(key);

      res.set({
        'Content-Type': fileInfo.contentType,
        'Content-Length': fileInfo.size.toString(),
        'Content-Disposition': `inline; filename="${fileInfo.metadata?.originalName || key}"`,
      });

      res.send(fileBuffer);
    } catch (error) {
      res.status(404).json({ error: 'File not found' });
    }
  }

  @Get('presigned-url/:key')
  @UseGuards(JwtAuthGuard)
  async getPresignedUrl(
    @Param('key') key: string,
    @Query('expiresIn') expiresIn: string = '3600',
    @Query('operation') operation: 'getObject' | 'putObject' = 'getObject',
  ) {
    const url = await this.s3Service.generatePresignedUrl(
      key,
      parseInt(expiresIn),
      operation,
    );

    return {
      success: true,
      data: {
        url,
        key,
        expiresIn: parseInt(expiresIn),
        operation,
      },
    };
  }

  @Get('file-info/:key')
  @UseGuards(JwtAuthGuard)
  async getFileInfo(@Param('key') key: string) {
    const fileInfo = await this.s3Service.getFileInfo(key);

    return {
      success: true,
      data: fileInfo,
    };
  }

  @Delete('file/:key')
  @UseGuards(JwtAuthGuard)
  async deleteFile(@Param('key') key: string) {
    await this.s3Service.deleteFile(key);

    return {
      success: true,
      message: 'File deleted successfully',
      key,
    };
  }

  @Get('health')
  async healthCheck() {
    try {
      // Try to check if bucket exists by checking a test key
      const testKey = 'health-check';
      await this.s3Service.fileExists(testKey);

      return {
        success: true,
        status: 'healthy',
        message: 'S3 storage is accessible',
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        message: 'S3 storage is not accessible',
        error: error.message,
      };
    }
  }
}
