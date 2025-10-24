import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto';
import { UserResponseDto } from '../users/dto';
import { JwtPayloadDto } from '@/libs/common/jwt.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    // Exclude password from response
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const user = await this.usersService.create(registerDto);
      const payload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload);

      return {
        user,
        accessToken,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Registration failed');
    }
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    return this.usersService.findOne(userId);
  }

  // Generate JWT token with custom options
  generateToken(payload: JwtPayloadDto): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow('JWT_EXPIRES_IN'),
    });
  }

  // Verify JWT token
  verifyToken(token: string): JwtPayloadDto {
    try {
      return this.jwtService.verify<JwtPayloadDto>(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
