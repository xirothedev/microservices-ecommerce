import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsNumberString, IsOptional, Length } from 'class-validator';
import { MfaType } from 'prisma/generated';

export class SetupMfaDto {
  @IsEnum(MfaType)
  @IsNotEmpty()
  type: MfaType;

  @IsOptional()
  @IsMobilePhone()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class VerifyMfaSetupDto {
  @IsEnum(MfaType)
  @IsNotEmpty()
  type: MfaType;

  @IsNumberString()
  @Length(6, 6)
  @IsNotEmpty()
  code: string;
}

export class ToggleMfaDto {
  @IsEnum(MfaType)
  @IsNotEmpty()
  type: MfaType;

  // Require when disable mfa
  @IsNumberString()
  @IsOptional()
  @Length(6, 6)
  code?: string;
} 