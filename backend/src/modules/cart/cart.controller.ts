import { Body, Controller, Req } from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import { AddProductCartDto } from './dto/add-product-cart.dto';
import { RemoveProductCartDto } from './dto/remove-product-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  add(@Req() req: Request, @Body() body: AddProductCartDto) {
    return this.cartService.add(req, body);
  }

  remove(@Req() req: Request, @Body() body: RemoveProductCartDto) {
    return this.cartService.remove(req, body);
  }
}
