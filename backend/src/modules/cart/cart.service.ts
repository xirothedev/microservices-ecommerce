import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { AddProductCartDto } from './dto/add-product-cart.dto';
import { Product } from '@prisma/generated';
import { RemoveProductCartDto } from './dto/remove-product-cart.dto';
import { UserQL } from '../users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  public async add(req: Request, body: AddProductCartDto) {
    const user = req.user;
    let product: Product;

    try {
      product = await this.prismaService.product.findUniqueOrThrow({ where: { id: body.productId } });
    } catch {
      throw new BadRequestException('Product not found');
    }

    let cartItem = await this.prismaService.cartItem.findUnique({
      where: {
        productUserId: {
          productId: body.productId,
          userId: user.id,
        },
      },
    });

    if (cartItem) {
      // If exists, update the quantity
      cartItem = await this.prismaService.cartItem.update({
        where: {
          productUserId: {
            productId: body.productId,
            userId: user.id,
          },
        },
        data: {
          quantity: { increment: body.quantity },
        },
        include: { product: true },
      });
    } else {
      // If not exists, create a new cart item
      cartItem = await this.prismaService.cartItem.create({
        data: {
          productId: body.productId,
          userId: user.id,
          quantity: body.quantity,
          unitPrice: product.discountPrice,
        },
        include: { product: true },
      });
    }

    return {
      message: 'Add product to cart successful',
      data: cartItem,
    };
  }

  public async remove(req: Request, body: RemoveProductCartDto) {
    const user = req.user;
    let cartItem = await this.prismaService.cartItem.findUnique({
      where: {
        productUserId: {
          productId: body.productId,
          userId: user.id,
        },
      },
    });

    if (!cartItem) {
      throw new BadRequestException('Product not found in cart');
    }

    if (body.quantity >= cartItem.quantity) {
      await this.prismaService.cartItem.delete({
        where: {
          productUserId: {
            productId: body.productId,
            userId: user.id,
          },
        },
      });
      return {
        message: 'Removed product from cart',
        data: null,
      };
    } else {
      cartItem = await this.prismaService.cartItem.update({
        where: {
          productUserId: {
            productId: body.productId,
            userId: user.id,
          },
        },
        data: {
          quantity: { decrement: body.quantity },
        },
        include: { product: true },
      });
      return {
        message: 'Decreased product quantity in cart',
        data: cartItem,
      };
    }
  }

  public async findCart(user: UserQL) {
    try {
      const carts = await this.prismaService.cartItem.findMany({ where: { userId: user.id } });

      return carts;
    } catch {
      throw new NotFoundException('Cart not found');
    }
  }
}
