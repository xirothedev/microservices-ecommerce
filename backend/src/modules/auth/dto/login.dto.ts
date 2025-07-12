import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Length } from 'class-validator';
import { MfaType } from 'prisma/generated';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  @Length(6, 6)
  mfaCode?: string;

  @IsOptional()
  @IsString()
  mfaType?: MfaType;

  @IsOptional()
  @IsString()
  backupCode?: string;
} 