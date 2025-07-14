import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Request } from 'express';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from 'prisma/generated';
import { SupabaseService } from '@/supabase/supabase.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async create(req: Request, body: CreateProductDto, medias: Express.Multer.File[]) {
    const seller = req.user;
    const urls: Array<string> = [];

    for (let i = 0; i < medias.length; i++) {
      const media = medias[i];

      const path = `${req.user.id}/${Date.now()}-${media.originalname}`;

      const { error } = await this.supabaseService.uploadFile(path, media.buffer, {
        contentType: media.mimetype,
      });

      if (error) {
        throw new InternalServerErrorException(`Failed to upload file: ${media.originalname}`);
      }

      urls.push(path);
    }

    try {
      const createdProduct = await this.prismaService.product.create({
        data: {
          slug: body.slug,
          name: body.name,
          description: body.description,
          flags: body.flags,
          originalPrice: body.originalPrice,
          discountPrice: body.discountPrice ?? body.originalPrice,
          categoryId: body.categoryId,
          stock: body.productItems.length,
          tags: body.tags,
          sellerId: seller.id,
          medias: urls,
          productItems: {
            createMany: { data: body.productItems, skipDuplicates: false },
          },
        },
      });

      return {
        message: 'Create product successful',
        data: createdProduct,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new Error('Slug is exist');
      }

      // Unknown error fallback
      throw error;
    }
  }
}
