import { EmailService } from '@/email/email.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { randomInt } from 'node:crypto';
import { Authentication, User } from 'prisma/generated';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { MfaService } from './mfa.service';
import { Payload } from './auth.interface';

export const MINIMUM_RETRY_TIME = 60_000;
export const MAXINUM_AVAILABLE_TIME = 5 * 60 * 1000; 

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly mfaService: MfaService,
    private readonly jwtService: JwtService,
  ) { }

  public async create(body: CreateAuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });
    if (user) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashing(body.password);

    const data = await this.prismaService.user.create({
      data: {
        email: body.email,
        fullname: body.fullname,
        hashedPassword,
      },
    });

    return {
      message: 'Created user succesful',
      data,
    };
  }

  public async login(body: LoginDto) {
    let user: User

    try {
      user = await this.prismaService.user.findUniqueOrThrow({
        where: { email: body.email },
        omit: { hashedPassword: false }
      });
    } catch {
      throw new NotFoundException('User not found');
    }

    if (!user.hashedPassword) {
      throw new MethodNotAllowedException("You need a password to perform this action")
    }

    const isValidPassword = await verify(body.password, user.hashedPassword)
    if (!isValidPassword) throw new UnauthorizedException('Invalid credentials');

    const hasMfa = await this.mfaService.hasMfaEnabled(user.id);

    // Check if user has MFA enabled
    if (hasMfa) {
      // If MFA is enabled but no MFA code provided, return MFA required response
      if (!body.mfaCode && !body.backupCode) {
        const mfaStatus = await this.mfaService.getMfaStatus(user.id);
        return {
          message: 'MFA verification required',
          requiresMfa: true,
          mfaMethods: mfaStatus.mfaMethods.filter(m => m.isEnabled),
          hasBackupCodes: mfaStatus.hasBackupCodes,
        };
      }

      // Verify MFA if code provided
      if (body.mfaCode && body.mfaType) {
        await this.mfaService.verifyMfa(user.id, {
          type: body.mfaType,
          code: body.mfaCode,
        });
      } else if (body.backupCode) {
        await this.mfaService.verifyMfa(user.id, {
          type: "BACKUP_CODE",
          code: body.backupCode,
        });
      } else {
        throw new BadRequestException('MFA code or backup code required');
      }
    }

    // Generate JWT token
    const payload: Payload = {
      sub: user.id,
      email: user.email,
      timestamp: new Date().toISOString(),
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('SUPABASE_JWT_SECRET'),
      expiresIn: '1h',
    });

    // Create login session
    const sessionToken = this.generateSessionToken();

    await this.prismaService.loginSession.create({
      data: {
        userId: user.id,
        sessionToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    return {
      message: 'Login successful',
      data: {
        user,
        accessToken,
        sessionToken,
        hasMfa,
      },
    };
  }

  public async verifyEmail(email: string) {
    let user: User;

    try {
      user = await this.prismaService.user.findUniqueOrThrow({
        where: { email },
      });
    } catch {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User verified');
    }

    const auth = await this.prismaService.authentication.findUnique({
      where: { id: { type: 'VERIFY_EMAIL', userId: user.id } },
    });

    if (auth && auth.lastSentAt > new Date(Date.now() - MINIMUM_RETRY_TIME)) {
      throw new BadRequestException('Please wait 1 minutes before requesting again');
    }

    const code = randomInt(100000, 999999).toString();
    const baseUrl = this.configService.getOrThrow<string>('APPLICATION_BASE_URL');
    const url = `${baseUrl}/auth/verify-email?code=${code}&email=${user.email}`;

    try {
      await this.emailService.sendVerifyEmail({ url, code, email: user.email });
    } catch {
      throw new InternalServerErrorException('Email servie error');
    }

    await this.prismaService.authentication.upsert({
      where: { id: { type: 'VERIFY_EMAIL', userId: user.id } },
      update: {
        code,
        retryTime: { increment: 1 },
        lastSentAt: new Date(),
        expiresAt: new Date(Date.now() + MAXINUM_AVAILABLE_TIME),
      },
      create: {
        code,
        userId: user.id,
        type: 'VERIFY_EMAIL',
        lastSentAt: new Date(),
        expiresAt: new Date(Date.now() + MAXINUM_AVAILABLE_TIME),
      },
    });

    return {
      message: 'Sent email succesful',
      data: null,
    };
  }

  public async confirmVerifyEmail(query: VerifyEmailDto) {
    let user: User;
    let auth: Authentication;

    try {
      user = await this.prismaService.user.findUniqueOrThrow({
        where: { email: query.email },
      });
    } catch {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User verified');
    }

    try {
      auth = await this.prismaService.authentication.findUniqueOrThrow({
        where: { id: { type: 'VERIFY_EMAIL', userId: user.id } },
      });
    } catch {
      throw new NotFoundException('Record not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User verified');
    }

    if (auth.expiresAt >= new Date() && auth.code !== query.code) {
      throw new UnauthorizedException('Wrong code or expired');
    }

    const data = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        roles: { push: 'USER' },
        isVerified: true,
        auth: { delete: { id: { type: 'VERIFY_EMAIL', userId: user.id } } },
      },
    });

    return {
      message: 'Verify succesful',
      data,
    };
  }

  // private helper
  private hashing(string: string) {
    return hash(string);
  }

  private generateSessionToken(): string {
    return randomInt(100000000000000, 999999999999999).toString();
  }
}
