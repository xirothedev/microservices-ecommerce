import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { Request, Response } from 'express';
import type { UserResponseDto } from '../users/dto';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.register(registerDto);

    // Set JWT token as HTTP-only cookie
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);

    // Set JWT token as HTTP-only cookie
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(
    @Req() req: Request & { user: UserResponseDto },
  ): Promise<UserResponseDto> {
    return this.authService.getProfile(req.user.id);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // Clear the access_token cookie
    res.clearCookie('access_token');
    return {
      message: 'Logged out successfully',
    };
  }

  // Microservice message patterns
  @MessagePattern('auth_validate_user')
  validateUser(@Payload() payload: { email: string; password: string }) {
    return this.authService.validateUser(payload.email, payload.password);
  }

  @MessagePattern('auth_login')
  authLogin(@Payload() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @MessagePattern('auth_register')
  authRegister(@Payload() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @MessagePattern('auth_get_profile')
  authGetProfile(@Payload() payload: { userId: string }) {
    return this.authService.getProfile(payload.userId);
  }
}
