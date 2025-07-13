import { IsSlug } from '@/common/decorators/is-slug.decorator';
import { IsSmallInt } from '@/common/decorators/is-smallInt.decorator';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { Product, ProductFlag } from 'prisma/generated';

export class CreateProductDto implements Partial<Product> {
  @IsNotEmpty()
  @IsSlug()
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsPositive()
  @IsOptional()
  @IsSmallInt()
  stock?: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsEnum(ProductFlag, { each: true })
  flags: ProductFlag[];

  @IsNotEmpty()
  @IsPositive()
  originalPrice: number;

  @IsOptional()
  @IsPositive()
  discountPrice?: number;
}
