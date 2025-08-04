import { SelectFrom } from '@prisma/generated';

export interface OrderItem {
  productId: string;
  productItemId: string;
  quantity: number;
  price: number;
  from: SelectFrom;
}
