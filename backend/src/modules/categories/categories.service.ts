import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  public async withCount() {
    const categories = await this.prismaService.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { products: true },
        },
      },
    });

    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      count: cat._count.products,
    }));

    return {
      message: 'Get categories successful',
      data: formatted,
    };
  }
}
