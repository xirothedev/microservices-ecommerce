import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AddProductCartDto } from './dto/add-product-cart.dto';
import { RemoveProductCartDto } from './dto/remove-product-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  public async add(req: Request, body: AddProductCartDto) {
    const user = req.user;
    const product = await this.prismaService.product.findUnique({
      where: { id: body.productId },
      select: { discountPrice: true },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    let cartItem = await this.prismaService.cartItem.findUnique({
      where: {
        productUserId: {
          productId: body.productId,
          userId: user.id,
        },
      },
      select: { id: true },
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
      select: { quantity: true },
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

  public async findCartByUserId(id: string) {
    const carts = await this.prismaService.cartItem.findMany({
      where: { userId: id },
      orderBy: { createAt: 'desc' },
      select: undefined,
    });
    return carts;
  }
}
