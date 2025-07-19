import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContextThrottlerGuard } from './common/guards/context-throttler.guard';
import { EmailModule } from './email/email.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthCookieGuard } from './modules/auth/guards/auth-cookie.guard';
import { CartModule } from './modules/cart/cart.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      sortSchema: true,
      playground: false,
      introspection: true,
      context: ({ req, res, connection }) => {
        if (connection) {
          // For subscriptions (WebSocket)
          return { req: connection.context };
        }
        // For HTTP requests
        return { req, res };
      },
      // https://docs.nestjs.com/graphql/subscriptions#authentication-over-websockets
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
      },
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ThrottlerModule.forRoot([{ ttl: 2000, limit: 100 }]),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    SupabaseModule,
    EmailModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ContextThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthCookieGuard,
    },
  ],
})
export class AppModule {}
