import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersServiceModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'users-service',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'users-service-group',
        },
      },
    },
  );

  await app.listen();
}

void bootstrap();
