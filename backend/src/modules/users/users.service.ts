import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user-input.dto';
import { Prisma } from 'prisma/generated';
import { UpdateUserByAdmin } from './dto/update-user-by-admin-input.dto';
import { Request } from 'express';
import { MediaService } from '@/media/media.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  // Resolver
  async findUser(id: string) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { id },
      });

      return user;
    } catch {
      throw new NotFoundException({ message: 'User not found' });
    }
  }

  async updateUser(id: string, input: UpdateUserInput) {
    try {
      const user = await this.prismaService.user.update({ where: { id }, data: input });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      throw error;
    }
  }

  async updateUserByAdmin(id: string, input: UpdateUserByAdmin) {
    try {
      const uniqueRoles = [...new Set(input.roles)];
      const uniqueFlags = [...new Set(input.flags)];
      const user = await this.prismaService.user.update({
        where: { id },
        data: {
          roles: { set: uniqueRoles },
          flags: { set: uniqueFlags },
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      throw error;
    }
  }

  // Controller
  async updateUserAvatar(req: Request, avatar: Express.Multer.File) {
    const user = req.user;
    let url: string;

    try {
      url = await this.mediaService.uploadSquareImage(avatar);
    } catch {
      throw new InternalServerErrorException('Failed to upload image');
    }

    if (user.avatarUrl && (await this.mediaService.getFile(user.avatarUrl))) {
      try {
        await this.mediaService.deleteFile(user.avatarUrl);
      } catch {
        throw new InternalServerErrorException('Failed to delete old image');
      }
    }

    const data = await this.prismaService.user.update({
      where: { id: user.id },
      data: { avatarUrl: url },
    });

    return {
      message: 'Updated user avatar successful',
      data,
    };
  }
}
