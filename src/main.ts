import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create REST API application
  const app = await NestFactory.create(AppModule);

  // Enable cookie parser
  app.use(cookieParser());

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS with credentials
  app.enableCors({
    origin: true, // In production, specify your frontend domain
    credentials: true, // Allow cookies to be sent
  });

  // Start REST API server
  await app.listen(process.env.PORT || 3000);

  // Create microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: { groupId: 'users-consumer' },
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices();
}
void bootstrap();
