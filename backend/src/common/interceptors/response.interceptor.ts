import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IResponseInterceptor } from '@/typings/interceptor';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((returns: IResponseInterceptor) => {
        const message = returns?.message || 'Success';
        delete returns.message;
        const data = returns?.data || null;
        delete returns.data;

        return {
          message,
          data,
          ...returns,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
