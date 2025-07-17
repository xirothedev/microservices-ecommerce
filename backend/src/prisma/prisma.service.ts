import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, BillStatus, BillType, PaymentMethod, UserRole } from '@prisma/generated';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';

// Helper: Generate UUIDs for foreign keys
const categoryIds = Array.from({ length: 5 }, () => faker.string.uuid());
const userIds = Array.from({ length: 10 }, () => faker.string.uuid());
const productIds = Array.from({ length: 10 }, () => faker.string.uuid());

// Category
const categories = categoryIds.map((id, i) => ({
  id,
  name: faker.commerce.department() + ' ' + i,
  slug: faker.helpers.slugify(faker.commerce.department() + '-' + i),
}));

// User
const users = userIds.map((id) => ({
  id,
  fullname: faker.person.fullName().slice(0, 50),
  email: faker.internet.email().slice(0, 255),
  phone: faker.phone.number().slice(0, 20),
  isVerified: faker.datatype.boolean(),
  hashedPassword: faker.internet.password(),
  avatarUrl: faker.image.avatar().slice(0, 500),
  address: faker.location.streetAddress().slice(0, 500),
  city: faker.location.city().slice(0, 50),
  state: faker.location.state().slice(0, 50),
  zipCode: faker.location.zipCode().slice(0, 10),
  biography: faker.lorem.sentence(),
  roles: [UserRole.USER],
  flags: [],
  createAt: faker.date.past(),
  updateAt: faker.date.recent(),
  credit: faker.number.int({ min: 0, max: 1000 }),
}));

// Product
const products = productIds.map((id, i) => ({
  id: id.slice(0, 25),
  createAt: faker.date.past(),
  updateAt: faker.date.recent(),
  sku: faker.string.alphanumeric(10).slice(0, 50),
  isActive: faker.datatype.boolean(),
  slug: faker.helpers.slugify(faker.commerce.productName() + '-' + i).slice(0, 255),
  name: faker.commerce.productName().slice(0, 255),
  description: faker.commerce.productDescription(),
  stock: faker.number.int({ min: 0, max: 100 }),
  sold: faker.number.int({ min: 0, max: 100 }),
  flags: [],
  originalPrice: faker.number.int({ min: 10, max: 500 }),
  discountPrice: faker.number.int({ min: 5, max: 400 }),
  averageRating: new Decimal(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 })),
  tags: [faker.commerce.productAdjective().slice(0, 100), faker.commerce.productMaterial().slice(0, 100)],
  medias: [faker.image.urlPicsumPhotos({ width: 400, height: 300 }).slice(0, 500)],
  categoryId: faker.helpers.arrayElement(categoryIds),
  sellerId: faker.helpers.arrayElement(userIds),
}));

// Bill
const billIds = Array.from({ length: 10 }, () => faker.string.uuid());
const bills = billIds.map((id) => ({
  id,
  createAt: faker.date.past(),
  updateAt: faker.date.recent(),
  transactionId: faker.string.alphanumeric(12),
  paymentMethod: PaymentMethod.MOMO,
  type: BillType.MONEY_IN,
  status: BillStatus.DONE,
  amount: faker.number.int({ min: 20, max: 1000 }),
  note: faker.lorem.sentence(),
  userId: faker.helpers.arrayElement(userIds),
}));

// Order
const orders = Array.from({ length: 10 }).map((_, i) => {
  const billId = billIds[i % billIds.length];
  return {
    id: faker.string.uuid(),
    createAt: faker.date.past(),
    updateAt: faker.date.recent(),
    totalPrice: faker.number.int({ min: 20, max: 1000 }),
    billId,
  };
});

// Ticket
const tickets = Array.from({ length: 10 }).map((_, i) => ({
  id: faker.string.uuid(),
  numericalOrder: i + 1,
  createAt: faker.date.past(),
  updateAt: faker.date.recent(),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  status: faker.helpers.arrayElement(['RESOLVED', 'IN_PROGRESS', 'WAITING', 'OPEN', 'CLOSED']),
  category: faker.helpers.arrayElement([
    'TECHNICAL_SUPPORT',
    'BILLING_PAYMENT',
    'ACCOUNT_ISSUE',
    'SERVICE_REQUEST',
    'REFUND_REQUEST',
    'GENERAL_INQUIRY',
  ]),
  priority: faker.helpers.arrayElement(['URGENT', 'HIGH', 'MEDIUM', 'LOW']),
  referenceContext: faker.lorem.sentence(),
  images: [faker.image.urlPicsumPhotos({ width: 400, height: 300 })],
  authorId: faker.helpers.arrayElement(userIds),
  assignedId: faker.helpers.arrayElement(userIds),
}));

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
      omit: { user: { hashedPassword: true } },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }

  async seed() {
    await this.category.createMany({ data: categories });
    await this.user.createMany({ data: users });
    await this.product.createMany({ data: products });
    await this.bill.createMany({ data: bills });
    await this.order.createMany({ data: orders });
    await this.ticket.createMany({ data: tickets });
    console.log('Seeded categories, users, products, bills, orders, tickets');
  }
}
