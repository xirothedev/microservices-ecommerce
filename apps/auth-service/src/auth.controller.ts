import { Body, Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthServiceService } from './auth.service';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from './interfaces/auth.interface';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Get()
  getHello(): string {
    return this.authServiceService.getHello();
  }

  @MessagePattern('auth.login')
  login(@Body() data: LoginRequest): AuthResponse {
    console.log('Auth Service - Login request:', data);
    return this.authServiceService.login(data);
  }

  @MessagePattern('auth.register')
  register(@Body() data: RegisterRequest): AuthResponse {
    console.log('Auth Service - Register request:', data);
    return this.authServiceService.register(data);
  }

  @MessagePattern('auth.validate')
  validateToken(@Body() data: { token: string }): AuthResponse {
    console.log('Auth Service - Validate token request');
    return this.authServiceService.validateToken(data.token);
  }
}
