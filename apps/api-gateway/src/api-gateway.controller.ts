import { Body, Controller, Get, Param, Post, Headers } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';
import type {
  CreateProductRequest,
  Product,
  ProductList,
} from './interfaces/product.interface';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from './interfaces/auth.interface';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  // Product endpoints
  @Post('api/products')
  createProduct(@Body() data: CreateProductRequest): Observable<Product> {
    console.log(
      'API Gateway - Calling ProductService.CreateProduct with:',
      data,
    );
    return this.apiGatewayService.createProduct(data);
  }

  @Get('api/products/:id')
  getProduct(@Param('id') id: string): Observable<Product> {
    console.log('API Gateway - Calling ProductService.GetProduct for ID:', id);
    return this.apiGatewayService.getProduct(id);
  }

  @Get('api/products')
  getAllProducts(): Observable<ProductList> {
    console.log('API Gateway - Calling ProductService.GetAllProducts');
    return this.apiGatewayService.getAllProducts();
  }

  // Auth endpoints
  @Post('api/auth/login')
  login(@Body() data: LoginRequest): Observable<AuthResponse> {
    console.log('API Gateway - Calling AuthService.Login with:', data);
    return this.apiGatewayService.login(data);
  }

  @Post('api/auth/register')
  register(@Body() data: RegisterRequest): Observable<AuthResponse> {
    console.log('API Gateway - Calling AuthService.Register with:', data);
    return this.apiGatewayService.register(data);
  }

  @Get('api/auth/validate')
  validateToken(
    @Headers('authorization') authHeader: string,
  ): Observable<AuthResponse> {
    const token = authHeader?.replace('Bearer ', '') || '';
    console.log('API Gateway - Calling AuthService.ValidateToken');
    return this.apiGatewayService.validateToken(token);
  }
}
