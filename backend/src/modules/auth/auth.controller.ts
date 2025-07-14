import { Public } from '@/common/decorators/public.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  ParseEnumPipe,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { SetupMfaDto, ToggleMfaDto, VerifyMfaSetupDto } from './dto/setup-mfa.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MfaService } from './mfa.service';
import { Request, Response } from 'express';
import { MfaStatus } from './auth.interface';
import { MfaVerificationDto, RequestMfaCodeDto } from './dto/mfa-verification.dto';
import { Cookies } from '@/common/decorators/cookie.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mfaService: MfaService,
  ) {}

  @Public()
  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @Public()
  login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response, @Cookies('session_id') sessionId: string) {
    return this.authService.login(body, res, sessionId);
  }

  @Post('verify-email')
  @Public()
  verifyEmail(@Body('email') email: string) {
    return this.authService.verifyEmail(email);
  }

  @Get('verify-email')
  @Public()
  confirmVerifyEmail(@Query() query: VerifyEmailDto) {
    return this.authService.confirmVerifyEmail(query);
  }

  @Post('refresh-token')
  refreshToken(
    @Cookies('refresh_token') tokenFromCookie: string,
    @Body('refreshToken') tokenFromBody: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.refreshToken(tokenFromCookie, tokenFromBody, req, res);
  }

  // MFA Setup endpoints
  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  setupMfa(@Req() req: Request, @Body() body: SetupMfaDto) {
    return this.mfaService.setupMfa(req, body);
  }

  @Post('mfa/verify-setup')
  @UseGuards(JwtAuthGuard)
  verifyMfaSetup(@Req() req: Request, @Body() body: VerifyMfaSetupDto) {
    return this.mfaService.verifyMfaSetup(req.user.id, body);
  }

  @Post('mfa/:status')
  @UseGuards(JwtAuthGuard)
  disableMfa(
    @Req() req: Request,
    @Param('status', new ParseEnumPipe(MfaStatus)) status: MfaStatus,
    @Body() disableDto: ToggleMfaDto,
  ) {
    return this.mfaService.toggleMfa(req.user.id, status, disableDto);
  }

  // MFA Verification endpoints
  @Post('mfa/verify/:id')
  @Public()
  verifyMfa(@Param('id') userId: string, @Body() body: MfaVerificationDto) {
    // Note: This endpoint should be used after initial login when MFA is required
    // The userId should be passed in the request body or extracted from a temporary session
    if (!userId) {
      throw new BadRequestException('Missing params');
    }
    return this.mfaService.verifyMfa(userId, body);
  }

  @Post('mfa/request-code')
  @Public()
  requestMfaCode(@Body() body: RequestMfaCodeDto) {
    // Note: This endpoint should be used after initial login when MFA is required
    // The userId should be passed in the request body or extracted from a temporary session
    return this.mfaService.requestMfaCode(body);
  }

  // MFA Status and Management
  @Get('mfa/status')
  @UseGuards(JwtAuthGuard)
  getMfaStatus(@Req() req: Request) {
    return this.mfaService.getMfaStatus(req.user.id);
  }

  @Post('mfa/regenerate-backup-codes')
  @UseGuards(JwtAuthGuard)
  regenerateBackupCodes(@Req() req: Request) {
    return this.mfaService.regenerateBackupCodes(req.user.id);
  }
}
