import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('prisma')
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  async seed() {
    await this.prismaService.seed();
    return { message: 'Database seeded successfully' };
  }
}
