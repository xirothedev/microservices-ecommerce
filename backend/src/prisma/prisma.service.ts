import { faker } from '@faker-js/faker';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  BillStatus,
  BillType,
  PaymentMethod,
  PrismaClient,
  UserRole,
  UserFlag,
  ProductFlag,
  Review,
  OrderItem,
  TicketUser,
  CartItem,
  Product,
  MfaSetup,
  Category,
} from '@prisma/generated';
import { hash } from 'argon2';
import Decimal from 'decimal.js';

// --- Helper functions ---
const unique = <T>(arr: T[]) => Array.from(new Set(arr));

let password: string = '';

void (async () => {
  password = await hash('password');
})();

// --- Generate IDs ---
const usedCategoryIds = new Set<string>();
const categoryIds: string[] = [];
while (categoryIds.length < 100) {
  const id = faker.string.uuid();
  if (usedCategoryIds.has(id)) continue;
  usedCategoryIds.add(id);
  categoryIds.push(id);
}
const userIds = Array.from({ length: 100 }, () => faker.string.uuid());
const productIds = Array.from({ length: 100 }, () => faker.string.alphanumeric(25));
const billIds = Array.from({ length: 100 }, () => faker.string.uuid());
const orderIds = Array.from({ length: 100 }, () => faker.string.uuid());
const ticketIds = Array.from({ length: 100 }, () => faker.string.uuid());
const productItemIds = Array.from({ length: 100 }, () => faker.string.alphanumeric(25));
const reviewIds = Array.from({ length: 100 }, () => faker.string.alphanumeric(25));
const cartItemIds = Array.from({ length: 100 }, () => faker.string.alphanumeric(25));
const ticketUserIds = Array.from({ length: 100 }, () => faker.string.uuid());
const ticketMessageIds = Array.from({ length: 100 }, () => faker.string.uuid());
const ticketContextIds = Array.from({ length: 100 }, () => faker.string.uuid());
const orderItemIds = Array.from({ length: 100 }, () => faker.string.uuid());
// const authenticationIds = Array.from({ length: 100 }, () => faker.string.uuid());
const mfaSetupIds = Array.from({ length: 100 }, () => faker.string.uuid());
const mfaBackupCodeIds = Array.from({ length: 100 }, () => faker.string.uuid());
const loginSessionIds = Array.from({ length: 100 }, () => faker.string.uuid());
// --- Category ---
const usedCategorySlugs = new Set<string>();
const categories: Category[] = [];
let categoryIndex = 0;
while (categories.length < categoryIds.length) {
  const id = categoryIds[categories.length];
  const name =
    unique([faker.commerce.department(), faker.commerce.productMaterial(), faker.commerce.productAdjective()]).join(
      ' ',
    ) +
    ' ' +
    categoryIndex;
  let slug;
  let tryCount = 0;
  do {
    if (tryCount > 20) {
      slug = faker.string.uuid();
      break;
    }
    slug = faker.helpers.slugify(faker.commerce.department() + '-' + categoryIndex).slice(0, 100);
    tryCount++;
  } while (usedCategorySlugs.has(slug));
  usedCategorySlugs.add(slug);
  categories.push({
    id,
    name,
    slug,
  });
  categoryIndex++;
}

// --- User ---
const users = userIds.map((id, i) => ({
  id,
  fullname: faker.person.fullName().slice(0, 50),
  email: `user${i}_${faker.internet.email().slice(0, 200)}`.slice(0, 255),
  phone: faker.phone.number().slice(0, 20),
  isVerified: faker.datatype.boolean(),
  hashedPassword: password,
  avatarUrl: faker.image.avatar().slice(0, 500),
  address: faker.location.streetAddress().slice(0, 500),
  city: faker.location.city().slice(0, 50),
  state: faker.location.state().slice(0, 50),
  zipCode: faker.location.zipCode().slice(0, 10),
  biography: faker.lorem.sentence(),
  roles: [faker.helpers.arrayElement(Object.values(UserRole))],
  flags: [faker.helpers.arrayElement(Object.values(UserFlag))],
  createAt: faker.date.past(),
  updateAt: faker.date.recent(),
  credit: faker.number.int({ min: 0, max: 1000 }),
}));

// --- Product ---
const usedSkus = new Set<string>();
const usedSlugs = new Set<string>();
const products: Product[] = [];
let productIndex = 0;
while (products.length < productIds.length) {
  const id = productIds[products.length];
  let sku;
  do {
    sku = faker.string.alphanumeric(10).slice(0, 50);
  } while (usedSkus.has(sku));
  usedSkus.add(sku);
  let slug;
  let tryCount = 0;
  do {
    if (tryCount > 20) {
      slug = faker.string.uuid();
      break;
    }
    slug = faker.helpers.slugify(faker.commerce.productName() + '-' + productIndex).slice(0, 255);
    tryCount++;
  } while (usedSlugs.has(slug));
  usedSlugs.add(slug);
  products.push({
    id,
    createAt: faker.date.past(),
    updateAt: faker.date.recent(),
    sku,
    isActive: faker.datatype.boolean(),
    slug,
    name: faker.commerce.productName().slice(0, 255),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 0, max: 100 }),
    sold: faker.number.int({ min: 0, max: 100 }),
    flags: [faker.helpers.arrayElement(Object.values(ProductFlag))],
    originalPrice: faker.number.int({ min: 10, max: 500 }),
    discountPrice: faker.number.int({ min: 5, max: 400 }),
    tags: [faker.commerce.productAdjective().slice(0, 100), faker.commerce.productMaterial().slice(0, 100)],
    medias: [faker.image.urlPicsumPhotos({ width: 400, height: 300 }).slice(0, 500)],
    categoryId: faker.helpers.arrayElement(categoryIds),
    sellerId: faker.helpers.arrayElement(userIds),
  });
  productIndex++;
}

// --- ProductItem ---
const productItems = productItemIds.map((id) => ({
  id,
  productId: faker.helpers.arrayElement(productIds),
  data: faker.lorem.paragraph(),
  isSold: faker.datatype.boolean(),
  soldAt: faker.datatype.boolean() ? faker.date.past() : null,
}));

// --- Review ---
const usedReviewPairs = new Set<string>();
const reviews: Review[] = [];
while (reviews.length < reviewIds.length) {
  const id = reviewIds[reviews.length];
  const productId = faker.helpers.arrayElement(productIds);
  const userId = faker.helpers.arrayElement(userIds);
  const pairKey = `${productId}_${userId}`;
  if (usedReviewPairs.has(pairKey)) continue;
  usedReviewPairs.add(pairKey);
  reviews.push({
    id,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    rating: new Decimal(faker.number.float({ min: 1, max: 5, fractionDigits: 1 }).toFixed(1)),
    comment: faker.lorem.sentences({ min: 1, max: 3 }),
    productId,
    userId,
  });
}

// --- Bill ---
const bills = billIds.map((id) => ({
  id,
  createAt: faker.date.past(),
  updateAt: faker.date.recent(),
  transactionId: faker.string.alphanumeric(12),
  paymentMethod: faker.helpers.arrayElement(Object.values(PaymentMethod)),
  type: faker.helpers.arrayElement(Object.values(BillType)),
  status: faker.helpers.arrayElement(Object.values(BillStatus)),
  amount: faker.number.int({ min: 20, max: 1000 }),
  note: faker.lorem.sentence(),
  userId: faker.helpers.arrayElement(userIds),
}));

// --- Order ---
const orders = orderIds.map((id, i) => ({
  id,
  createAt: faker.date.past(),
  updateAt: faker.date.recent(),
  totalPrice: faker.number.int({ min: 20, max: 1000 }),
  billId: billIds[i],
}));

// --- OrderItem ---
const usedOrderProductItemIds = new Set<string>();
const orderItems: OrderItem[] = [];
while (orderItems.length < orderItemIds.length) {
  const id = orderItemIds[orderItems.length];
  const productId = faker.helpers.arrayElement(productIds);
  let productItemId;
  do {
    productItemId = faker.helpers.arrayElement(productItemIds);
  } while (usedOrderProductItemIds.has(productItemId));
  usedOrderProductItemIds.add(productItemId);
  const orderId = faker.helpers.arrayElement(orderIds);
  orderItems.push({
    id,
    from: faker.helpers.arrayElement(['CART', 'SERVICES']),
    quantity: faker.number.int({ min: 1, max: 5 }),
    price: faker.number.int({ min: 10, max: 500 }),
    productId,
    productItemId,
    orderId,
  });
}

// --- CartItem ---
const usedCartItemPairs = new Set<string>();
const cartItems: CartItem[] = [];
while (cartItems.length < cartItemIds.length) {
  const id = cartItemIds[cartItems.length];
  const productId = faker.helpers.arrayElement(productIds);
  const userId = faker.helpers.arrayElement(userIds);
  const pairKey = `${productId}_${userId}`;
  if (usedCartItemPairs.has(pairKey)) continue;
  usedCartItemPairs.add(pairKey);
  cartItems.push({
    id,
    createAt: faker.date.past(),
    updateAt: faker.date.recent(),
    quantity: faker.number.int({ min: 1, max: 5 }),
    unitPrice: faker.number.int({ min: 10, max: 500 }),
    productId,
    userId,
  });
}

// --- Ticket ---
const tickets = ticketIds.map((id, i) => ({
  id,
  numericalOrder: i + 1,
  createAt: faker.date.past(),
  updateAt: faker.date.recent(),
  title: faker.lorem.sentence().slice(0, 255),
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
  attachments: [faker.image.urlPicsumPhotos({ width: 400, height: 300 })],
  authorId: faker.helpers.arrayElement(userIds),
  assignedId: faker.helpers.arrayElement(userIds),
}));

// --- TicketUser ---
const usedTicketUserPairs = new Set<string>();
const ticketUsers: TicketUser[] = [];
while (ticketUsers.length < ticketUserIds.length) {
  const id = ticketUserIds[ticketUsers.length];
  const ticketId = faker.helpers.arrayElement(ticketIds);
  const userId = faker.helpers.arrayElement(userIds);
  const pairKey = `${ticketId}_${userId}`;
  if (usedTicketUserPairs.has(pairKey)) continue;
  usedTicketUserPairs.add(pairKey);
  ticketUsers.push({
    id,
    lastReadAt: faker.date.past(),
    ticketId,
    userId,
    lastReadMessageId: null,
  });
}

// --- TicketMessage ---
const ticketMessages = ticketMessageIds.map((id) => {
  const ticketId = faker.helpers.arrayElement(ticketIds);
  const senderId = faker.helpers.arrayElement(ticketUserIds);
  return {
    id,
    content: faker.lorem.sentences({ min: 1, max: 3 }),
    isRead: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ticketId,
    senderId,
    attachments: [faker.image.urlPicsumPhotos({ width: 400, height: 300 })],
  };
});

// --- TicketContext ---
const ticketContexts = ticketContextIds.map((id) => {
  const ticketId = faker.helpers.arrayElement(ticketIds);
  return {
    id,
    type: faker.helpers.arrayElement(['ORDER', 'PRODUCT', 'TRANSACTION', 'ACCOUNT']),
    label: faker.lorem.words(3),
    ticketId,
  };
});

// --- Authentication ---
// const authentications = authenticationIds.map(() => {
//   const userId = faker.helpers.arrayElement(userIds);
//   return {
//     code: faker.string.numeric(6),
//     type: faker.helpers.arrayElement(['VERIFY_EMAIL', 'MFA_EMAIL', 'MFA_SMS', 'MFA_TOTP', 'PASSWORD_RESET']),
//     retryTime: faker.number.int({ min: 0, max: 5 }),
//     lastSentAt: faker.date.past(),
//     expiresAt: faker.date.future(),
//     userId,
//   };
// });

// --- MfaSetup ---
const usedMfaSetupPairs = new Set<string>();
const mfaSetups: MfaSetup[] = [];
while (mfaSetups.length < mfaSetupIds.length) {
  const id = mfaSetupIds[mfaSetups.length];
  const userId = faker.helpers.arrayElement(userIds);
  const type = faker.helpers.arrayElement(['TOTP', 'SMS', 'EMAIL']);
  const pairKey = `${userId}_${type}`;
  if (usedMfaSetupPairs.has(pairKey)) continue;
  usedMfaSetupPairs.add(pairKey);
  mfaSetups.push({
    id,
    userId,
    type,
    isEnabled: faker.datatype.boolean(),
    secret: faker.internet.password(),
    phone: faker.phone.number().slice(0, 20),
    email: faker.internet.email().slice(0, 255),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  });
}

// --- MfaBackupCode ---
const mfaBackupCodes = mfaBackupCodeIds.map((id) => {
  const userId = faker.helpers.arrayElement(userIds);
  return {
    id,
    code: faker.string.alphanumeric(10),
    isUsed: faker.datatype.boolean(),
    usedAt: faker.datatype.boolean() ? faker.date.past() : null,
    createdAt: faker.date.past(),
    userId,
  };
});

// --- LoginSession ---
const loginSessions = loginSessionIds.map((id) => {
  const userId = faker.helpers.arrayElement(userIds);
  return {
    id,
    sessionId: faker.string.alphanumeric(32),
    refreshToken: faker.string.alphanumeric(64),
    ipAddress: faker.internet.ip(),
    userAgent: faker.internet.userAgent(),
    isActive: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    lastUsedAt: faker.date.recent(),
    userId,
  };
});

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
    await this.productItem.createMany({ data: productItems });
    await this.review.createMany({ data: reviews });
    await this.bill.createMany({ data: bills });
    await this.order.createMany({ data: orders });
    await this.orderItem.createMany({ data: orderItems });
    await this.cartItem.createMany({ data: cartItems });
    await this.ticket.createMany({ data: tickets });
    await this.ticketUser.createMany({ data: ticketUsers });
    await this.ticketMessage.createMany({ data: ticketMessages });
    await this.ticketContext.createMany({ data: ticketContexts });
    // await this.authentication.createMany({ data: authentications });
    await this.mfaSetup.createMany({ data: mfaSetups });
    await this.mfaBackupCode.createMany({ data: mfaBackupCodes });
    await this.loginSession.createMany({ data: loginSessions });
    console.log('Seeded all tables with at least 100 records each.');
  }
}
