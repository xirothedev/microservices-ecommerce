import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user-input.dto';
import { Prisma } from 'prisma/generated';
import { UpdateUserByAdmin } from './dto/update-user-by-admin-input.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUser(id: string) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { id }
      })

      return user
    } catch {
      throw new NotFoundException({ message: "User not found" });
    }
  }

  async updateUser(id: string, input: UpdateUserInput) {
    try {
      const user = await this.prismaService.user.update({ where: { id }, data: input })

      return user
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
        where: { id }, data: {
          roles: { set: uniqueRoles },
          flags: { set: uniqueFlags }
        }
      })

      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      throw error;
    }
  }
}
