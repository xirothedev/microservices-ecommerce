import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Product, ProductFlag } from '@prisma/generated';

registerEnumType(ProductFlag, {
  name: 'ProductFlag',
});

@ObjectType()
export class ProductQL implements Partial<Product> {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  categoryId: string;

  @Field(() => ID)
  sellerId: string;

  @Field()
  createAt: Date;

  @Field()
  updateAt: Date;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  slug: string;

  @Field()
  sold: number;

  @Field()
  stock: number;

  @Field(() => [String])
  tags: string[];

  @Field()
  originalPrice: number;

  @Field()
  discountPrice: number;

  @Field(() => [ProductFlag])
  flags: ProductFlag[];

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  sku?: string;

  @Field(() => [String])
  medias: string[];
}
