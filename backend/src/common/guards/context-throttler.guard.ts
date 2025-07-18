import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ContextThrottlerGuard extends ThrottlerGuard {
  override getRequestResponse(context: ExecutionContext) {
    if (context.getType<'graphql' | 'http'>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const req = gqlContext.getContext().req;
      const res = gqlContext.getContext().res;
      return { req, res };
    }

    const httpContext = context.switchToHttp();
    return {
      req: httpContext.getRequest(),
      res: httpContext.getResponse(),
    };
  }

  protected getTracker(req: Record<string, any>): Promise<string> {
    return req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  }
}
