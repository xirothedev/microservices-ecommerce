import { IsEmail, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumberString()
  @Length(6, 6)
  @IsNotEmpty()
  code: string;
}
