import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { MfaType } from 'prisma/generated';

const MfaTypeWithBackupCode = { ...MfaType, BACKUP_CODE: "BACKUP_CODE" }
export type MfaTypeWithBackupCode = MfaType | "BACKUP_CODE"

export class MfaVerificationDto {
  @IsEnum(MfaTypeWithBackupCode)
  @IsNotEmpty()
  type: MfaTypeWithBackupCode;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsString()
  sessionId?: string; // For tracking the login session
}

export class RequestMfaCodeDto {
  @IsEnum(MfaType)
  @IsNotEmpty()
  type: MfaType;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsMobilePhone()
  phone?: string;
} 