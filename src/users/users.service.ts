import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import { S3Service } from '@/storage/s3.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, username, password, ...rest } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        ...rest,
      },
    });

    return this.excludePassword(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });

    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.excludePassword(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const { password, ...rest } = updateUserDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id, isActive: true },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check for email/username conflicts if they're being updated
    if (rest.email || rest.username) {
      const conflictUser = await this.prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                rest.email ? { email: rest.email } : {},
                rest.username ? { username: rest.username } : {},
              ].filter((condition) => Object.keys(condition).length > 0),
            },
          ],
        },
      });

      if (conflictUser) {
        throw new ConflictException(
          'User with this email or username already exists',
        );
      }
    }

    const updateData: Partial<User> = { ...rest };

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return this.excludePassword(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateAvatar(
    userId: string,
    avatarUrl: string,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    return this.excludePassword(updatedUser);
  }

  async deleteAvatar(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If user has an avatar, try to delete it from S3
    if (user.avatar) {
      try {
        // Extract key from avatar URL
        const urlParts = user.avatar.split('/');
        const key = urlParts[urlParts.length - 1];
        await this.s3Service.deleteFile(key);
      } catch (error) {
        // Log error but don't fail the operation
        console.warn('Failed to delete avatar from S3:', error);
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: null },
    });

    return this.excludePassword(updatedUser);
  }

  private excludePassword(user: User): UserResponseDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
