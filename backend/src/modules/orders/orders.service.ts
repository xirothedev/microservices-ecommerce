import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BillStatus, BillType, Prisma, SelectFrom } from '@prisma/generated';
import { Request } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { OrderItem } from './orders.interface';
import { PdfGeneratorService } from './pdf-generator.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pdfGeneratorService: PdfGeneratorService,
  ) {}

  public async create(req: Request, createOrderDto: CreateOrderDto) {
    const user = req.user;

    // Validate and calculate total price
    let totalPrice = 0;
    const orderItemsData: OrderItem[] = [];

    for (const item of createOrderDto.items) {
      // Validate product exists and is active
      const product = await this.prismaService.product.findFirst({
        where: {
          id: item.productId,
          isActive: true,
        },
        select: {
          id: true,
          discountPrice: true,
          stock: true,
        },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found or inactive`);
      }

      // Validate product item exists and is not sold
      const productItem = await this.prismaService.productItem.findFirst({
        where: {
          id: item.productItemId,
          productId: item.productId,
          isSold: false,
        },
        select: {
          id: true,
        },
      });

      if (!productItem) {
        throw new NotFoundException(`Product item ${item.productItemId} not found or already sold`);
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${item.productId}`);
      }

      const itemPrice = product.discountPrice * item.quantity;
      totalPrice += itemPrice;

      orderItemsData.push({
        productId: item.productId,
        productItemId: item.productItemId,
        quantity: item.quantity,
        price: itemPrice,
        from: item.from,
      });
    }

    try {
      const result = await this.prismaService.$transaction(async (tx) => {
        // Create bill first
        const bill = await tx.bill.create({
          data: {
            paymentMethod: createOrderDto.paymentMethod,
            type: BillType.MONEY_IN,
            status: BillStatus.PENDING,
            amount: totalPrice,
            note: createOrderDto.note || '',
            userId: user.id,
          },
        });

        // Create order
        const order = await tx.order.create({
          data: {
            totalPrice,
            userId: user.id,
            billId: bill.id,
            items: {
              createMany: {
                data: orderItemsData,
              },
            },
          },
          include: {
            items: {
              include: {
                product: true,
                productItem: true,
              },
            },
            bill: true,
          },
        });

        // Mark product items as sold and update stock
        for (const item of createOrderDto.items) {
          await tx.productItem.update({
            where: { id: item.productItemId },
            data: { isSold: true },
          });

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
              sold: { increment: item.quantity },
            },
          });
        }

        // If order was created from cart, clear cart items
        if (createOrderDto.from === SelectFrom.CART) {
          const productIds = createOrderDto.items.map((item) => item.productId);
          await tx.cartItem.deleteMany({
            where: {
              userId: user.id,
              productId: { in: productIds },
            },
          });
        }

        return order;
      });

      return {
        message: 'Order created successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Failed to create order: ' + error.message);
      }
      throw error;
    }
  }

  public async createFromCart(req: Request, body: { paymentMethod: string; note?: string }) {
    const user = req.user;

    // Get cart items
    // eslint-disable-next-line prisma/require-select
    const cartItems = await this.prismaService.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            discountPrice: true,
            stock: true,
            isActive: true,
            productItems: {
              where: { isSold: false },
              take: 1,
            },
          },
        },
      },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Convert cart items to order items
    const orderItems = cartItems.map((cartItem) => {
      if (!cartItem.product.isActive) {
        throw new BadRequestException(`Product ${cartItem.product.id} is no longer active`);
      }

      if (cartItem.product.stock < cartItem.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${cartItem.product.id}`);
      }

      if (cartItem.product.productItems.length === 0) {
        throw new BadRequestException(`No available product items for ${cartItem.product.id}`);
      }

      return {
        productId: cartItem.productId,
        productItemId: cartItem.product.productItems[0].id,
        quantity: cartItem.quantity,
        from: SelectFrom.CART,
      };
    });

    // Create order using existing create method
    const createOrderDto: CreateOrderDto = {
      items: orderItems,
      paymentMethod: body.paymentMethod as any,
      note: body.note,
      from: SelectFrom.CART,
    };

    return this.create(req, createOrderDto);
  }

  public async findAll(req: Request, query: FindAllOrdersDto) {
    const user = req.user;
    const { page, limit, cursor, status, search, startDate, endDate } = query;
    const take = limit ?? 20;
    let skip: number | undefined = undefined;
    let cursorObj: Prisma.OrderWhereUniqueInput | undefined = undefined;

    // Handle pagination
    if (cursor) {
      cursorObj = { id: cursor };
      skip = 1;
    } else if (page && page > 1) {
      skip = (page - 1) * take;
    }

    // Build where clause
    const where: Prisma.OrderWhereInput = {
      userId: user.id,
    };

    if (status) {
      where.bill = { status };
    }

    if (search) {
      where.items = {
        some: {
          product: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    if (startDate || endDate) {
      where.createAt = {};
      if (startDate) where.createAt.gte = new Date(startDate);
      if (endDate) where.createAt.lte = new Date(endDate);
    }

    // eslint-disable-next-line prisma/require-select
    const orders = await this.prismaService.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                medias: true,
                discountPrice: true,
              },
            },
          },
        },
        bill: true,
      },
      orderBy: [{ createAt: 'desc' }, { id: 'desc' }],
      take: take + 1,
      skip,
      ...(cursorObj && { cursor: cursorObj }),
    });

    const totalItems = await this.prismaService.order.count({ where });

    let nextCursor: string | null = null;
    let hasNextPage = false;
    let result = orders;

    if (orders.length > take) {
      hasNextPage = true;
      const nextItem = orders[take];
      nextCursor = nextItem?.id ?? null;
      result = orders.slice(0, take);
    }

    return {
      message: 'Get orders successful',
      data: result,
      '@data': {
        totalItems,
        nextCursor,
        hasNextPage,
      },
    };
  }

  public async findSellerOrders(req: Request, query: FindAllOrdersDto) {
    const seller = req.user;
    const { page, limit, cursor, status, search, startDate, endDate } = query;
    const take = limit ?? 20;
    let skip: number | undefined = undefined;
    let cursorObj: Prisma.OrderWhereUniqueInput | undefined = undefined;

    // Handle pagination
    if (cursor) {
      cursorObj = { id: cursor };
      skip = 1;
    } else if (page && page > 1) {
      skip = (page - 1) * take;
    }

    const where: Prisma.OrderWhereInput = {
      items: {
        some: {
          product: {
            sellerId: seller.id,
          },
        },
      },
    };

    if (status) {
      where.bill = { status };
    }

    if (search) {
      where.items = {
        some: {
          product: {
            sellerId: seller.id,
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    if (startDate || endDate) {
      where.createAt = {};
      if (startDate) where.createAt.gte = new Date(startDate);
      if (endDate) where.createAt.lte = new Date(endDate);
    }

    // eslint-disable-next-line prisma/require-select
    const orders = await this.prismaService.order.findMany({
      where,
      include: {
        items: {
          where: {
            product: { sellerId: seller.id },
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                medias: true,
                discountPrice: true,
              },
            },
          },
        },
        bill: true,
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
      orderBy: [{ createAt: 'desc' }, { id: 'desc' }],
      take: take + 1,
      skip,
      ...(cursorObj && { cursor: cursorObj }),
    });

    const totalItems = await this.prismaService.order.count({ where });

    let nextCursor: string | null = null;
    let hasNextPage = false;
    let result = orders;

    if (orders.length > take) {
      hasNextPage = true;
      const nextItem = orders[take];
      nextCursor = nextItem?.id ?? null;
      result = orders.slice(0, take);
    }

    return {
      message: 'Get seller orders successful',
      data: result,
      '@data': {
        totalItems,
        nextCursor,
        hasNextPage,
      },
    };
  }

  public async findOne(req: Request, id: string) {
    const user = req.user;

    // eslint-disable-next-line prisma/require-select
    const order = await this.prismaService.order.findFirst({
      where: {
        id,
        OR: [{ userId: user.id }, { items: { some: { product: { sellerId: user.id } } } }],
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: {
                  select: {
                    id: true,
                    fullname: true,
                  },
                },
              },
            },
            productItem: true,
          },
        },
        bill: true,
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      message: 'Get order successful',
      data: order,
    };
  }

  public async getOrderItems(req: Request, orderId: string) {
    const user = req.user;

    const order = await this.prismaService.order.findFirst({
      where: {
        id: orderId,
        OR: [{ userId: user.id }, { items: { some: { product: { sellerId: user.id } } } }],
      },
      select: { id: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // eslint-disable-next-line prisma/require-select
    const orderItems = await this.prismaService.orderItem.findMany({
      where: { orderId },
      include: {
        product: {
          include: {
            category: true,
            seller: {
              select: {
                id: true,
                fullname: true,
              },
            },
          },
        },
        productItem: true,
      },
    });

    return {
      message: 'Get order items successful',
      data: orderItems,
    };
  }

  public async cancel(req: Request, orderId: string) {
    const user = req.user;

    // eslint-disable-next-line prisma/require-select
    const order = await this.prismaService.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        bill: true,
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.bill.status !== BillStatus.PENDING) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    try {
      await this.prismaService.$transaction(async (tx) => {
        // Update bill status
        await tx.bill.update({
          where: { id: order.billId },
          data: { status: BillStatus.CANCELLED },
        });

        // Restore product items and stock
        for (const item of order.items) {
          await tx.productItem.update({
            where: { id: item.productItemId },
            data: { isSold: false },
          });

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
              sold: { decrement: item.quantity },
            },
          });
        }
      });

      return {
        message: 'Order cancelled successfully',
      };
    } catch {
      throw new BadRequestException('Failed to cancel order');
    }
  }

  public async refund(orderId: string) {
    // eslint-disable-next-line prisma/require-select
    const order = await this.prismaService.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        bill: true,
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.bill.status !== BillStatus.DONE) {
      throw new BadRequestException('Order cannot be refunded');
    }

    try {
      await this.prismaService.$transaction(async (tx) => {
        // Update bill status
        await tx.bill.update({
          where: { id: order.billId },
          data: { status: BillStatus.REFUNDED },
        });

        // Restore product items and stock
        for (const item of order.items) {
          await tx.productItem.update({
            where: { id: item.productItemId },
            data: { isSold: false },
          });

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
              sold: { decrement: item.quantity },
            },
          });
        }
      });

      return {
        message: 'Order refunded successfully',
      };
    } catch {
      throw new BadRequestException('Failed to refund order');
    }
  }

  public async generateInvoice(req: Request, orderId: string): Promise<Buffer> {
    const user = req.user;

    // Get order with all details
    // eslint-disable-next-line prisma/require-select
    const order = await this.prismaService.order.findFirst({
      where: {
        id: orderId,
        userId: user.id, // Only allow users to download their own invoices
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: {
                  select: {
                    id: true,
                    fullname: true,
                  },
                },
              },
            },
          },
        },
        bill: true,
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found or access denied');
    }

    // Only allow invoice download for completed orders
    if (order.bill.status !== BillStatus.DONE) {
      throw new BadRequestException('Invoice is only available for completed orders');
    }

    return this.pdfGeneratorService.generateInvoicePDF(order);
  }
}
