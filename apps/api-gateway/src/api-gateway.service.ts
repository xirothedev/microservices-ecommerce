import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  CreateProductRequest,
  Product,
  ProductList,
} from './interfaces/product.interface';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from 'apps/auth-service/src/interfaces/auth.interface';
import {
  CreateUserRequest,
  User,
  UserList,
} from 'apps/users-service/src/interfaces/user.interface';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientKafka,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    @Inject('USERS_SERVICE') private readonly userClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // Subscribe to response topics for products
    this.productClient.subscribeToResponseOf('product.create');
    this.productClient.subscribeToResponseOf('product.get');
    this.productClient.subscribeToResponseOf('product.getAll');

    // Subscribe to response topics for auth
    this.authClient.subscribeToResponseOf('auth.login');
    this.authClient.subscribeToResponseOf('auth.register');
    this.authClient.subscribeToResponseOf('auth.validate');

    // Subscribe to response topics for users
    this.userClient.subscribeToResponseOf('user.create');
    this.userClient.subscribeToResponseOf('user.get');
    this.userClient.subscribeToResponseOf('user.getAll');

    // Connect to Kafka
    await this.productClient.connect();
    await this.authClient.connect();
  }

  // Product methods
  createProduct(productData: CreateProductRequest): Observable<Product> {
    return this.productClient.send('product.create', productData);
  }

  getProduct(id: string): Observable<Product> {
    return this.productClient.send('product.get', { id });
  }

  getAllProducts(): Observable<ProductList> {
    return this.productClient.send('product.getAll', {});
  }

  // Auth methods
  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.authClient.send('auth.login', loginData);
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.authClient.send('auth.register', registerData);
  }

  validateToken(token: string): Observable<AuthResponse> {
    return this.authClient.send('auth.validate', { token });
  }

  // Users methods
  createUser(userData: CreateUserRequest): Observable<User> {
    return this.userClient.send('user.create', userData);
  }

  getUser(id: string): Observable<User> {
    return this.userClient.send('user.get', { id });
  }

  getAllUsers(): Observable<UserList> {
    return this.userClient.send('user.getAll', {});
  }
}
