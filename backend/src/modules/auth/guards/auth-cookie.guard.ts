import { type ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthCookieGuard extends AuthGuard('auth-cookie') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
