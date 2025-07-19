import { ProductQL } from '@/modules/products/entities/product.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CartItem } from '@prisma/generated';

@ObjectType()
export class CartItemQL implements Partial<CartItem> {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  productId: string;

  @Field()
  createAt: Date;

  @Field()
  updateAt: Date;

  @Field()
  quantity: number;

  @Field()
  unitPrice: number;

  @Field(() => ProductQL, { nullable: true })
  product?: ProductQL;
}
