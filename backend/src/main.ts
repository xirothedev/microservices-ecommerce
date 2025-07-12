import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

// Swagger config
const swaggerConfig = new DocumentBuilder()
  .setTitle('Store backend service')
  .setDescription('Store backend service API description')
  .setVersion('1.0')
  .build();

// Helmet config
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`],
      styleSrc: [`'self'`, `'unsafe-inline'`],
      imgSrc: [`'self'`, 'data:', 'validator.swagger.io', 'apollo-server-landing-page.cdn.apollographql.com'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
      frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
    },
  },
};

// CORS config
const corsConfig = {
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  transports: ['websocket', 'polling'],
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: corsConfig });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory);

  // Middleware
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(helmet(helmetConfig));
  app.use(compression());

  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
