import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ProductQL } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { CartItemQL } from './entities/cart.entity';

@Resolver(() => CartItemQL)
export class CartResolver {
  constructor(private readonly productsService: ProductsService) {}

  @ResolveField(() => ProductQL)
  public product(@Parent() cartItem: CartItemQL) {
    return this.productsService.getProductById(cartItem.productId);
  }
}
